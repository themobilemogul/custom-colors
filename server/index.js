const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const cron = require('node-cron');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json());

const TMP_DIR = path.join(__dirname, 'tmp_images');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

app.use('/images', express.static(TMP_DIR));

// Auto-delete images older than 1 hour
cron.schedule('*/30 * * * *', () => {
  const files = fs.readdirSync(TMP_DIR);
  files.forEach(file => {
    const filePath = path.join(TMP_DIR, file);
    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtimeMs;
    if (age > 1000 * 60 * 60) {
      fs.unlinkSync(filePath);
    }
  });
});

// Generate Image
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const MODEL_VERSION_ID = '01bc6fbe2bc89772101c97c7363a59329b75ed9354aa6ed3024f05f08a692d43';
    const response = await axios.post(
      `https://api.replicate.com/v1/models/adams38/red_page_ai/versions/${MODEL_VERSION_ID}/predictions`,
      {
        input: {
          prompt: `CLOR image of ${prompt}. Style sketched. No shading. Only use black and white. Not realistic.`,
          output_format: 'jpg'
        }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let prediction = response.data;
    const predictionUrl = prediction.urls.get;
    let attempts = 0;
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pollResponse = await axios.get(predictionUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });
      prediction = pollResponse.data;
      if (++attempts > 15) throw new Error('Timeout: prediction did not complete in time');
    }

    if (prediction.status === 'succeeded') {
      const originalUrl = prediction.output[0];
      const imageRes = await axios.get(originalUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageRes.data);

      const id = uuidv4();
      const rawPath = path.join(TMP_DIR, `${id}_raw.jpg`);
      const watermarkedPath = path.join(TMP_DIR, `${id}_watermarked.jpg`);

      fs.writeFileSync(rawPath, imageBuffer);

      const watermarkSVG = Buffer.from(`
        <svg width="800" height="800">
          <text x="50%" y="50%" text-anchor="middle" fill="Red" font-size="64" font-family="Arial" opacity="0.4" transform="rotate(-30, 400, 400)">PREVIEW</text>
        </svg>
      `);

      await sharp(imageBuffer)
        .composite([{ input: watermarkSVG, gravity: 'center' }])
        .jpeg()
        .toFile(watermarkedPath);

      const host = 'https://custom-colors.onrender.com';
      res.json({
        output: `${host}/images/${id}_watermarked.jpg`,
        final: `${host}/images/${id}_raw.jpg`
      });
    } else {
      throw new Error(`Prediction failed with status: ${prediction.status}`);
    }
  } catch (error) {
    console.error('❌ Error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: error?.response?.data || error.message || 'Unknown error' });
  }
});

// Handle custom-generated image checkout (per image pricing)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/checkout', async (req, res) => {
  const { images } = req.body;
  if (!images || !images.length) return res.status(400).json({ error: 'No images provided.' });

  try {
    // Download and create PDF
    const id = uuidv4();
    const pdfPath = path.join(TMP_DIR, `${id}_book.pdf`);
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    for (const url of images) {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      const img = doc.openImage(res.data);
      doc.addPage({ size: [img.width, img.height] });
      doc.image(img, 0, 0);
    }

    doc.end();

    await new Promise(resolve => stream.on('finish', resolve));

    const downloadUrl = `https://custom-colors.onrender.com/images/${id}_book.pdf`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Custom Coloring Book' },
            unit_amount: Math.round(images.length * 1.99 * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.customcolors.store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.customcolors.store`,

      metadata: { downloadUrl }
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error("❌ Custom image checkout error:", err.message);
    res.status(500).json({ error: 'Failed to create custom image checkout session.' });
  }
});

// Pre-made book checkout — unchanged
app.post('/create-checkout-session', async (req, res) => {
  const { book } = req.body;
  if (!book || !book.name || !book.price) {
    return res.status(400).json({ error: 'Book name and price are required.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.name,
              description: book.description || '',
              images: book.coverImage ? [book.coverImage] : [],
            },
            unit_amount: Math.round(book.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.customcolors.store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.customcolors.store/cancel`,

      metadata: {
        bookName: book.name,
        downloadUrl: book.downloadUrl || '',
        coverImage: book.coverImage || '',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session creation failed:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

app.get('/books', async (req, res) => {
  const table = encodeURIComponent("Coloring Book Pages");
  const baseId = process.env.AIRTABLE_BASE_ID;
  const token = process.env.AIRTABLE_API_KEY;

  try {
    const response = await axios.get(`https://api.airtable.com/v0/${baseId}/${table}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const books = response.data.records.map((record) => {
      const allPics = [];
      for (let i = 1; i <= 10; i++) {
        const field = record.fields[`Pic ${i}`];
        if (field && field[0]) allPics.push(field[0].url);
      }

      return {
        id: record.id,
        name: record.fields["Name"],
        type: record.fields["Type"],
        description: record.fields["Notes"],
        price: parseFloat(record.fields["Price"]) || 0,
        coverImage: record.fields["Cover"]?.[0]?.url || null,
        pages: allPics,
        downloadUrl: record.fields["Download"]?.[0]?.url || null
      };
    });

    res.json(books);
  } catch (error) {
    console.error("❌ Airtable fetch failed", error);
    res.status(500).json({ error: "Failed to fetch books from Airtable." });
  }
});

// Tokenized download links for premade books
const downloadLinks = new Map();

app.post('/generate-download-link', (req, res) => {
  const { downloadUrl } = req.body;
  if (!downloadUrl) return res.status(400).json({ error: 'Missing download URL' });
  const token = uuidv4();
  downloadLinks.set(token, { url: downloadUrl, createdAt: Date.now() });
  res.json({ link: `https://custom-colors.onrender.com/download/${token}` });
});

app.get('/download/:token', (req, res) => {
  const entry = downloadLinks.get(req.params.token);
  if (!entry) return res.status(404).send("Link expired or invalid");
  const age = Date.now() - entry.createdAt;
  if (age > 10 * 60 * 1000) {
    downloadLinks.delete(req.params.token);
    return res.status(403).send("Download link expired");
  }
  res.redirect(entry.url);
});

app.get('/session/:id', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    const downloadUrl = session.metadata.downloadUrl;
    const coverImage = session.metadata.coverImage;
    if (!downloadUrl) {
      return res.status(400).json({ error: 'Missing download URL in session metadata' });
    }
    res.json({ downloadUrl, coverImage });
  } catch (err) {
    console.error("❌ Error retrieving session:", err.message);
    res.status(500).json({ error: 'Failed to retrieve session from Stripe' });
  }
});

app.listen(5000, () => {
  console.log('✅ Server is running on https://custom-colors.onrender.com');
});

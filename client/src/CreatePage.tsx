import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

interface ImageRequest {
  id: number;
  prompt: string;
  imageUrl: string;
  finalImageUrl: string;
  loading: boolean;
  error: string;
  inputImage: File | null;
}

const examplePrompts = [
  "A dog riding a skateboard",
  "A fantasy castle on a hill",
  "A cat playing guitar",
  "A dragon flying over mountains",
  "A garden full of butterflies"
];

const faqs = [
  {
    q: "What is this for?",
    a: "Create personalized coloring books for birthdays, weddings, anniversaries, family trips, or just for fun!"
  },
  {
    q: "What pictures make the best coloring book pages?",
    a: "Use well-lit photos with minimal shadows and simple backgrounds. Less busy images produce cleaner results."
  },
  {
    q: "Can I use photos of people?",
    a: "Yes! Portraits and group shots work great, especially if the faces are clearly visible."
  },
  {
    q: "What’s the best resolution or file size?",
    a: "High-resolution images (over 1000x1000px) give the best coloring page results. Avoid blurry or pixelated photos."
  },
  {
    q: "How does text-to-image generation work?",
    a: "Just describe a scene, like 'a unicorn at the beach', and our AI turns it into a black-and-white line drawing."
  },
  {
    q: "Can I combine multiple pages into one book?",
    a: "Yes! After creating your pages, use the checkout to order a printed custom coloring book."
  }
];

const CreatePage = () => {
  const [mode, setMode] = useState<'text' | 'image'>("text");
  const [requests, setRequests] = useState<ImageRequest[]>([
    { id: 1, prompt: "", imageUrl: "", finalImageUrl: "", loading: false, error: "", inputImage: null }
  ]);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>([]);

  useEffect(() => {
    while (inputRefs.current.length < requests.length) {
      inputRefs.current.push(React.createRef());
    }
  }, [requests.length]);

  const updateRequest = (index: number, data: Partial<ImageRequest>) => {
    setRequests(prev => {
      const updated = [...prev];
      // Prevent 'id' from being overwritten with undefined
      const { id, ...restData } = data;
      if (updated[index]) {
        updated[index] = { ...updated[index], ...restData, id: updated[index].id };
      }
      return updated;
    });
  };

  const generateImage = async (index: number) => {
    const item = requests[index];
    if (!item) return;
    if (mode === "text" && !item.prompt.trim()) return;
    if (mode === "image" && !item.inputImage) return;

    updateRequest(index, { loading: true, imageUrl: "", finalImageUrl: "", error: "" });

    try {
      let response;
      if (mode === "text") {
        response = await fetch("http://localhost:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: item.prompt })
        });
      } else {
        const formData = new FormData();
        formData.append("image", item.inputImage!);
        response = await fetch("http://localhost:5000/image-to-image", {
          method: "POST",
          body: formData
        });
      }

      const data = await response.json();
      console.log("Raw backend response:", data);
      console.log("Response status:", response.status);
      if (response.ok && data.output && data.final) {
         console.log("✅ Image paths received:", data.output, data.final);
        updateRequest(index, {
          imageUrl: data.output,
          finalImageUrl: data.final
        });
      } else {
        updateRequest(index, { error: data.error || "Failed to generate image." });
      }
    } catch (err: any) {
      updateRequest(index, { error: err.message || "Something went wrong." });
    } finally {
      updateRequest(index, { loading: false });
    }
  };

  const addNewRequest = () => {
    const newId = requests.length + 1;
    setRequests(prev => [...prev, {
      id: newId, prompt: "", imageUrl: "", finalImageUrl: "", loading: false, error: "", inputImage: null
    }]);
  };

  const deleteRequest = (index: number) => {
    setRequests(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      inputRefs.current.splice(index, 1);
      return updated;
    });
  };

  const handleCheckout = async () => {
  const finalImages = requests.map(r => r.finalImageUrl).filter(Boolean);
  if (finalImages.length === 0) return alert("No images to purchase!");

  const res = await fetch("http://localhost:5000/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: finalImages })
  });

  const data = await res.json();
  if (data.sessionUrl) {
    window.location.href = data.sessionUrl; // redirect to Stripe
  } else {
    alert("Failed to initiate checkout.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto text-center mt-10 px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">Create Your Custom Coloring Book</h1>
        <p className="text-gray-600 mb-6">Use text or upload an image to create a beautiful black-and-white coloring page.</p>

        <div className="flex justify-center gap-4 mb-6">

          <button
            onClick={() => setMode("text")}
            className={`w-56 py-2 rounded-lg font-medium ${mode === "text" ? "bg-blue-500 text-white" : "bg-white border border-blue-300 text-blue-700"}`}
          >Create from Text</button>
          <button
            onClick={() => setMode("image")}
            className={`w-56 py-2 rounded-lg font-medium ${mode === "image" ? "bg-blue-500 text-white" : "bg-white border border-blue-300 text-blue-700"}`}
          >Create from Existing Image</button>
        </div>
          
          {mode === "image" && (
            <p className="text-yellow-600 font-semibold mb-8 text-center">
              Image to Image Generation Coming Soon!
            </p>
          )}


        {mode === "text" && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  addNewRequest();
                  updateRequest(requests.length, { prompt });
                }}
                className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200"
              >{prompt}</button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-12 px-4">
        {requests.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg space-y-6 w-full p-6">
            {mode === "text" ? (
              <input
                ref={inputRefs.current[index]}
                type="text"
                value={item.prompt}
                onChange={(e) => updateRequest(index, { prompt: e.target.value })}
                placeholder="Describe what you want to see..."
                className="block w-full border px-4 py-3 rounded-xl shadow-sm text-lg"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateRequest(index, { inputImage: e.target.files?.[0] || null })}
                className="block w-full border px-4 py-3 rounded-xl shadow-sm text-lg"
              />
            )}

            {item.error && <p className="text-red-500 text-sm italic">{item.error}</p>}

            {item.imageUrl && (
  <div className="p-0 rounded-xl shadow-sm">
    <img
      src={item.imageUrl}
      alt={`Generated image ${item.id}`}
      onError={() => console.error(`❌ Failed to load image for item ${item.id}:`, item.imageUrl)}
      className="mx-auto w-full max-w-[500px] rounded-xl border border-gray-300"
    />
  </div>
)}


            <div className="flex flex-wrap gap-4 justify-start items-center pt-2">
              <button
                onClick={() => generateImage(index)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition w-full sm:w-auto"
                disabled={item.loading}
              >{item.loading ? "Loading..." : "Create Coloring Book Page"}</button>

              {index !== 0 && (
                <button
                  onClick={() => deleteRequest(index)}
                  className="bg-red-100 text-red-600 px-6 py-2 rounded-xl hover:bg-red-200 transition w-full sm:w-auto"
                >Delete</button>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={addNewRequest}
                className="text-blue-600 font-medium text-sm hover:underline"
              >+ Create Another</button>
            </div>
          </div>
        ))}

        <div className="pt-8">
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white text-lg font-semibold py-4 w-full rounded-2xl hover:bg-green-600"
          >Proceed to Checkout</button>
        </div>

        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-gray-500 pb-10 px-6 mt-20">
        <p className="italic mb-2">
          Custom Colors was created to give people a peaceful space to reconnect with themselves through creativity.
        </p>
        <p className="mb-1">© 2025 Custom Colors. All rights reserved.</p>
        <a href="/about" className="text-blue-500 hover:underline">About</a>
      </footer>
    </div>
  );
};

export default CreatePage;

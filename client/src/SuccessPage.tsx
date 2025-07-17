import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";

const SuccessPage = () => {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchDownloadLink = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("Missing session ID from Stripe.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/session/${sessionId}`);
        const data = await res.json();

        if (!data.downloadUrl) {
          throw new Error("No download URL found in session.");
        }

        setCoverImage(data.coverImage || null); // coverImage should be added in Stripe metadata
        const genRes = await fetch("http://localhost:5000/generate-download-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ downloadUrl: data.downloadUrl }),
        });

        const genData = await genRes.json();
        if (!genData.link) throw new Error("No tokenized download link returned.");

        setDownloadLink(genData.link);
      } catch (err: any) {
        console.error("❌ Error fetching download link:", err.message);
        setError("There was a problem generating your download link. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadLink();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-green-50 text-center px-6 py-10">
      <Header />

      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Thank you for your purchase!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your coloring book is ready to download below. <br />
          If you need help, email us at <a href="mailto:info@customcolors.store" className="underline text-green-800">info@customcolors.store</a>. <br />
          Please note that add blockers or similar software may interfere with the download process.
        </p>

        {coverImage && (
          <img
            src={coverImage}
            alt="Coloring Book Cover"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-8"
          />
        )}

        {loading && <p className="text-gray-500">Preparing your download...</p>}

        {!loading && downloadLink && (
          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-block bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Download Your Coloring Book
          </a>
        )}

        {!loading && error && (
          <p className="text-red-500 mt-6 text-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;

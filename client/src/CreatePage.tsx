import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";

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
    q: "How much does it cost?",
    a: "$1.99 per page to remove the water mark and download as a PDF"
  },
  {
    q: "Can purchase a physical coloring book?",
    a: "Not yet, but very soon! For now only digital copy's will be provided upon check out"
  },
  {
    q: "Can I convert my own photos to coloring book pages?",
    a: "Not yet but soon!"
  },
  {
    q: "Why does my coloring book page look weird?",
    a: "Our model is still learning so you may get an unexpected result. Don't worry we are working on making our model better every day!"
  },
  {
    q: "How does text-to-image generation work?",
    a: "Just describe a scene, like 'a unicorn at the beach', and our AI turns it into a black-and-white line drawing."
  },
  {
    q: "What is your return policy?",
    a: "By checking out you agree that all sales are final. If you have any concerns please contact us at info@customcolors.store"
  },
  {
    q: "What pictures make the best coloring book pages?",
    a: "Use well-lit photos with minimal shadows and simple backgrounds. Less busy images produce cleaner results."
  }
];

const CreatePage = () => {
  const [mode, setMode] = useState<'text' | 'image'>("text");
  const [requests, setRequests] = useState<ImageRequest[]>([{
    id: 1, prompt: "", imageUrl: "", finalImageUrl: "", loading: false, error: "", inputImage: null
  }]);
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    while (inputRefs.current.length < requests.length) {
      inputRefs.current.push(React.createRef<HTMLInputElement>());
    }
  }, [requests.length]);

  const updateRequest = (index: number, data: Partial<ImageRequest>) => {
    setRequests(prev => {
      const updated = [...prev];
      const id = updated[index]?.id ?? 0;
      updated[index] = { ...updated[index], ...data, id };
      return updated;
    });
  };

  const moveRequest = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= requests.length) return;

    setRequests(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);

      const [movedRef] = inputRefs.current.splice(fromIndex, 1);
      inputRefs.current.splice(toIndex, 0, movedRef);

      return updated;
    });
  };

  const generateImage = async (index: number) => {
    const item = requests[index];
    if (!item) return;

    if (mode === "text" && !item.prompt?.trim()) return;
    if (mode === "image" && !item.inputImage) return;

    updateRequest(index, { loading: true, imageUrl: "", finalImageUrl: "", error: "" });

    try {
      let response;

      if (mode === "text") {
        response = await fetch("https://custom-colors.onrender.com/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: item.prompt })
        });
      } else {
        const formData = new FormData();
        if (item.inputImage) {
          formData.append("image", item.inputImage);
        }
        response = await fetch("https://custom-colors.onrender.com/image-to-image", {
          method: "POST",
          body: formData
        });
      }

      const data = await response.json();
      if (response.ok && data.output && data.final) {
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

  const resetRequest = (index: number) => {
    updateRequest(index, {
      prompt: "",
      imageUrl: "",
      finalImageUrl: "",
      loading: false,
      error: "",
      inputImage: null
    });
  };

  const handleCheckout = async () => {
    const finalImages = requests.map(r => r.finalImageUrl).filter(Boolean);
    if (finalImages.length === 0) return alert("No images to purchase!");

    const res = await fetch("https://custom-colors.onrender.com/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: finalImages })
    });

    const data = await res.json();
    if (data.sessionUrl) {
      window.location.href = data.sessionUrl;
    } else {
      alert("Failed to initiate checkout.");
    }
  };

  const totalPrice = requests.filter(r => r.finalImageUrl).length * 1.99;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto text-center mt-10 px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">Create Your Custom Coloring Book</h1>
        <p className="text-gray-600 mb-6">Use text or upload an image to create a beautiful black-and-white coloring page.</p>

        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setMode("text")}
            className={`w-56 py-2 rounded-lg font-medium ${mode === "text" ? "bg-blue-500 text-white" : "bg-white border border-blue-300 text-blue-700"}`}>Create from Text Prompt</button>
          <button onClick={() => setMode("image")}
            className={`w-56 py-2 rounded-lg font-medium ${mode === "image" ? "bg-blue-500 text-white" : "bg-white border border-blue-300 text-blue-700"}`}>Create from Existing Image</button>
        </div>

        {mode === "image" && (
          <p className="text-yellow-600 font-semibold mb-8 text-center">Image to Image Generation Coming Soon!</p>
        )}

        {mode === "text" && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {examplePrompts.map((prompt, i) => (
              <button key={i} onClick={() => {
                addNewRequest();
                updateRequest(requests.length, { prompt });
              }}
                className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200">{prompt}</button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-12 px-4">
        {requests.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg space-y-6 w-full p-6">
            {mode === "text" ? (
              <input ref={inputRefs.current[index]} type="text" value={item.prompt} onChange={(e) => updateRequest(index, { prompt: e.target.value })}
                placeholder="Describe what you want to see..."
                className="block w-full border px-4 py-3 rounded-xl shadow-sm text-lg" />
            ) : (
              <input type="file" accept="image/*" onChange={(e) => updateRequest(index, { inputImage: e.target.files?.[0] || null })}
                className="block w-full border px-4 py-3 rounded-xl shadow-sm text-lg" />
            )}

            {item.error && <p className="text-red-500 text-sm italic">{item.error}</p>}

            {item.imageUrl && (
              <div className="p-0 rounded-xl shadow-sm">
                <img src={item.imageUrl} alt={`Generated image ${item.id}`} className="mx-auto w-full max-w-[500px] rounded-xl border border-gray-300" />
              </div>
            )}

            {item.loading && (
              <div className="flex justify-center">
                <div className="animate-spin h-6 w-6 border-4 border-blue-300 border-t-transparent rounded-full"></div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
              <button onClick={() => generateImage(index)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition w-full sm:w-auto"
                disabled={item.loading}>{item.loading ? "Loading..." : "Create Coloring Book Page"}</button>

              <button onClick={() => index === 0 ? resetRequest(index) : deleteRequest(index)}
                className="bg-red-100 text-red-600 px-6 py-2 rounded-xl hover:bg-red-200 transition w-full sm:w-auto">Delete</button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={addNewRequest} className="text-blue-600 font-medium text-sm hover:underline">+ Create Another Page</button>
              <div className="space-x-2">
                <button onClick={() => moveRequest(index, index - 1)} className="text-blue-500 hover:underline">↑</button>
                <button onClick={() => moveRequest(index, index + 1)} className="text-blue-500 hover:underline">↓</button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8">
          <button
             onClick={() => setShowModal(true)}
             className="bg-green-500 text-white text-lg font-semibold py-4 w-full rounded-2xl hover:bg-green-600">
             Proceed to Checkout
             </button>
        </div>

        <div className="mt-16 border-t pt-10 pb-64">
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

      <footer className="text-center text-sm text-gray-500 pb-10 px-6">
        <p className="italic mb-2">Custom Colors was created to give people a peaceful space to reconnect with themselves through creativity.</p>
        <p className="mb-1">© 2025 Custom Colors. All rights reserved.</p>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative">
            <button className="absolute top-3 left-4 text-xl font-bold text-gray-600" onClick={() => setShowModal(false)}>×</button>
            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Preview Your Coloring Book</h2>

            <div className="flex justify-center items-center mb-4 gap-4">
              <button onClick={() => setPreviewIndex(p => Math.max(p - 1, 0))} className="text-lg px-2">←</button>
              <img src={requests.map(r => r.imageUrl).filter(Boolean)[previewIndex] || ""} alt="Preview" className="w-60 h-80 object-contain border rounded-xl" />
              <button onClick={() => setPreviewIndex(p => Math.min(p + 1, requests.length - 1))} className="text-lg px-2">→</button>
            </div>

            <p className="text-center text-sm text-gray-500 mb-2">Pages will be delivered in the order presented above. You may change the order of your book by using the arrows on the book creation tool.</p>
            <p className="text-center text-sm mb-4 text-gray-500">{previewIndex + 1} of {requests.filter(r => r.imageUrl).length}</p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`w-full border px-4 py-2 rounded-lg mb-3 ${emailTouched && !isValidEmail(email) ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {emailTouched && !isValidEmail(email) && (
              <p className="text-red-500 text-sm mb-2">Please enter a valid email address.</p>
            )}

            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Choose an option:</label>
              <div className="flex gap-4">
                <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 font-semibold text-sm">PDF Download</div>
                <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-500 text-sm">Printed Book (Coming Soon)</div>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <input type="checkbox" id="accept" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mr-2" />
              <label htmlFor="accept" className="text-sm text-gray-700">I understand all sales are final.</label>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="subscribe" checked={subscribe} onChange={e => setSubscribe(e.target.checked)} className="mr-2" />
              <label htmlFor="subscribe" className="text-sm text-gray-700">Send me occasional email updates</label>
            </div>

            <p className="text-center font-semibold text-lg text-gray-800 mb-4">Total: ${totalPrice.toFixed(2)}</p>

            <button
              disabled={!isValidEmail(email) || !acceptTerms}
              onClick={() => {
                handleCheckout();
                setShowModal(false);
              }}
              className={`w-full py-3 rounded-xl text-white font-semibold ${isValidEmail(email) && acceptTerms ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>



  );
};

export default CreatePage;

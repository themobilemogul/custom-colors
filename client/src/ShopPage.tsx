import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import RotatingGallery from "./RotatingGallery";

interface Book {
  id: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  pages: string[];
  type: string;
  downloadUrl?: string;
}

const ShopPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<"adult" | "children">("adult");
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [previewIndexMap, setPreviewIndexMap] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://custom-colors.onrender.com/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Failed to load books:", err);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) => book.type?.toLowerCase() === filter
  );

  const handleNext = (id: string, pages: string[]) => {
    if (pages.length > 0) {
      setPreviewIndexMap((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const handlePrev = (id: string) => {
    setPreviewIndexMap((prev) => ({ ...prev, [id]: -1 }));
  };

  const handleCheckout = async () => {
    if (!selectedBook) return;

    try {
      localStorage.setItem("purchasedBook", JSON.stringify(selectedBook));

      const res = await fetch("https://custom-colors.onrender.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: selectedBook })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed to start.");
      }
    } catch (err) {
      console.error("❌ Stripe Checkout error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans">
      <Header />
      <main className="px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-blue-600 mb-6 text-center">
          Shop Coloring Books
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Browse curated books made by the community. Perfect for gifts or inspiration.
        </p>

        <section className="w-full flex justify-center items-center mb-8 px-4 overflow-hidden">
          <div className="max-w-7xl w-full">
            <RotatingGallery />
          </div>
        </section>

        <div className="flex justify-center gap-4 mb-10">
          {["adult", "children"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "adult" | "children")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-300 text-blue-600"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-6 justify-items-center">
          {filteredBooks.map((book) => {
            const previewIndex = previewIndexMap[book.id] ?? -1;
            const displayImage = previewIndex === -1 ? book.coverImage : book.pages[previewIndex];

            return (
              <div
                key={book.id}
                onMouseEnter={() => setHoveredBookId(book.id)}
                onMouseLeave={() => {
                  setHoveredBookId(null);
                  setPreviewIndexMap((prev) => ({ ...prev, [book.id]: -1 }));
                }}
                className="relative bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden w-[320px] flex flex-col"
              >
                <div className="h-[320px] bg-gray-50 flex items-center justify-center relative">
                  <img
                    src={displayImage}
                    alt={book.name}
                    className="h-[300px] w-auto object-contain transition duration-200"
                  />

                  {hoveredBookId === book.id && previewIndex !== -1 && (
                    <button
                      onClick={() => handlePrev(book.id)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-1 hover:shadow-lg transition"
                    >
                      ←
                    </button>
                  )}

                  {hoveredBookId === book.id && previewIndex === -1 && book.pages.length > 0 && (
                    <button
                      onClick={() => handleNext(book.id, book.pages)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-1 hover:shadow-lg transition"
                    >
                      →
                    </button>
                  )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow text-center h-[200px]">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[40px]">{book.description}</p>
                    <p className="text-base font-bold text-gray-900 mb-4">${book.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowModal(true);
                    }}
                    className="w-full mt-auto px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading books...</h3>
            <p className="text-gray-500">Check back later for new coloring books!</p>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 pb-10 px-6">
        <p className="italic mb-2">
          Custom Colors was created to give people a peaceful space to reconnect with themselves through creativity.
        </p>
        <p className="mb-1">© 2025 Custom Colors. All rights reserved.</p>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </footer>

      {showModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-3 left-4 text-xl font-bold text-gray-600"
              onClick={() => setShowModal(false)}
            >×</button>

            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Preview Your Coloring Book</h2>

            <div className="flex justify-center items-center mb-4">
              <button className="text-lg px-2">←</button>
              <img
                src={selectedBook.coverImage}
                alt="Preview"
                className="w-60 h-80 object-contain border rounded-xl"
              />
              <button className="text-lg px-2">→</button>
            </div>

            <p className="text-center text-sm mb-2 text-gray-500">Pages will be delivered in the order presented above. You may change the order of your book by using the arrows on the book creation tool.</p>

            <p className="text-center text-sm mb-2 text-gray-500">1 of 1</p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`w-full border px-4 py-2 rounded-lg mb-1 ${emailTouched && !isValidEmail(email) ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {emailTouched && !isValidEmail(email) && (
              <p className="text-red-500 text-sm mb-2">Please enter a valid email address.</p>
            )}

            <div className="mb-2">
              <label className="block mb-1 text-sm text-gray-700">Choose an option:</label>
              <div className="flex gap-4">
                <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 font-semibold text-sm">PDF Download</div>
                <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-500 text-sm">Printed Book (Coming Soon)</div>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <input type="checkbox" id="accept" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mr-2" />
              <label htmlFor="accept" className="text-sm text-gray-700">I understand all sales are final.</label>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="subscribe" checked={subscribe} onChange={e => setSubscribe(e.target.checked)} className="mr-2" />
              <label htmlFor="subscribe" className="text-sm text-gray-700">Send me occasional email updates</label>
            </div>

            <p className="text-center text-lg font-bold mb-4">Total: ${selectedBook.price.toFixed(2)}</p>

            <button
              disabled={!isValidEmail(email) || !acceptTerms}
              onClick={() => {
                handleCheckout();
                setShowModal(false);
              }}
              className={`w-full py-3 rounded-xl text-white font-semibold ${isValidEmail(email) && acceptTerms ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;

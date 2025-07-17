import React, { useEffect, useState } from "react";
import Header from "./Header";

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/books");
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

  const handlePurchase = async (book: Book) => {
    try {
      localStorage.setItem("purchasedBook", JSON.stringify(book));

      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book }),
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

        {/* Filter Buttons */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-6 justify-items-center">
          {filteredBooks.map((book) => {
            const previewIndex = previewIndexMap[book.id] ?? -1;
            const displayImage =
              previewIndex === -1 ? book.coverImage : book.pages[previewIndex];

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
                {/* Image Area */}
                <div className="h-[320px] bg-gray-50 flex items-center justify-center relative">
                  <img
                    src={displayImage}
                    alt={book.name}
                    className="h-[300px] w-auto object-contain transition duration-200"
                  />

                  {/* Left Arrow */}
                  {hoveredBookId === book.id && previewIndex !== -1 && (
                    <button
                      onClick={() => handlePrev(book.id)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-1 hover:shadow-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Right Arrow */}
                  {hoveredBookId === book.id && previewIndex === -1 && book.pages.length > 0 && (
                    <button
                      onClick={() => handleNext(book.id, book.pages)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-1 hover:shadow-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-grow text-center h-[200px]">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[40px]">
                      {book.description}
                    </p>
                    <p className="text-base font-bold text-gray-900 mb-4">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePurchase(book)}
                    className="w-full mt-auto px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading books...
            </h3>
            <p className="text-gray-500">
              Check back later for new coloring books!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
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

export default ShopPage;

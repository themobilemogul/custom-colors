import React from "react";
import Header from "./Header";

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Header />

      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
          Monthly Coloring Book Subscriptions
        </h1>
        <p className="text-md font-semibold text-blue-500 mb-6">
          🎨 Coming August 2025 — stay tuned!
        </p>
        <p className="text-lg text-gray-600 mb-10">
          We're putting the final touches on our monthly subscription service. Soon, you'll be able to receive themed coloring pages straight to your inbox or mailbox each month — designed to bring peace, creativity, and joy to your day.
        </p>

        <div className="bg-white shadow-lg rounded-2xl p-8 mb-10 border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">What to expect:</h2>
          <ul className="text-left text-gray-700 list-disc list-inside space-y-3">
            <li>8–10 new coloring pages delivered monthly</li>
            <li>Fresh themes every month: nature, mindfulness, animals & more</li>
            <li>Downloadable PDFs and mailed prints available</li>
            <li>Exclusive bonus content for subscribers</li>
            <li>Easy cancellation, anytime</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            disabled
            className="bg-gray-400 text-white px-8 py-3 rounded-full shadow-md cursor-not-allowed"
          >
            Subscribe Coming Soon
          </button>
          <button
            disabled
            className="bg-white border border-gray-400 text-gray-400 px-8 py-3 rounded-full shadow-sm cursor-not-allowed"
          >
            Gift Option Coming Soon
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 pb-10 px-6">
        <p className="italic mb-2">
          Join our growing community of mindful creators. Find peace through color.
        </p>
        <p className="mb-1">© 2025 Custom Colors. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SubscriptionPage;

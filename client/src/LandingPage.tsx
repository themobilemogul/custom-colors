import React from "react";
import { Link } from "react-router-dom";
import RotatingGallery from "./RotatingGallery";
import Header from "./Header"; // Adjust path if needed

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen text-gray-800 font-sans">
      <Header />

      {/* Hero */}
      <section className="text-center px-4 py-12 max-w-8xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-6">
          Create Custom Coloring Books
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Whether you're creating a coloring book for a loved one or coloring to calm your mind — Custom Colors is here for you.
        </p>
        <Link
          to="/create"
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Start Creating
        </Link>
      </section>

      {/* Rotating Gallery */}
<section className="w-full flex justify-center items-center mb-8 px-4 overflow-hidden">
  <div className="max-w-7xl w-full">
    <RotatingGallery />
  </div>
</section>

      {/* Offerings */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Premade Books</h3>
          <p className="text-gray-600 mb-4">
            Curated coloring books made by artists and our community. Perfect as gifts or personal inspiration.
          </p>
          <Link to="/shop" className="text-blue-500 font-medium hover:underline">
            View Shop →
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Custom Coloring Books</h3>
          <p className="text-gray-600 mb-4">
            Create a custom coloring book perfect for a birthday, anniversary, or just to make someone happy.
          </p>
          <Link to="/create" className="text-blue-500 font-medium hover:underline">
            Create Now →
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Coloring Book Subscription</h3>
          <p className="text-gray-600 mb-4">
            Get themed coloring pages sent to your inbox or mailbox monthly. Cancel anytime.
          </p>
          <Link to="/subscription" className="text-blue-500 font-medium hover:underline">
            Learn More →
          </Link>
        </div>
      </section>

{/* Transformation Gallery */}
<section className="py-8 px-6 flex flex-col items-center">
  <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-10 text-center">
    From Photo to Coloring Page to Masterpiece
  </h3>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
    {/* Original Image */}
    <div className="flex flex-col items-center">
      <img
        src="/orig_home.jpg"
        alt="Original"
        className="w-[220px] h-[330px] object-cover rounded-xl shadow-md"
      />
      <p className="mt-2 text-sm text-gray-500">Original Photo</p>
    </div>

    {/* Arrow */}
    <span className="text-3xl text-gray-400 hidden sm:inline">→</span>

    {/* Coloring Page */}
    <div className="flex flex-col items-center">
      <img
        src="/person_021.png"
        alt="Coloring Page"
        className="w-[220px] h-[330px] object-cover rounded-xl shadow-md"
      />
      <p className="mt-2 text-sm text-gray-500">AI-Generated Coloring Page</p>
    </div>

    {/* Arrow */}
    <span className="text-3xl text-gray-400 hidden sm:inline">→</span>

    {/* Colored Page */}
    <div className="flex flex-col items-center">
      <img
        src="/filled_home.png"
        alt="Colored Page"
        className="w-[220px] h-[330px] object-cover rounded-xl shadow-md"
      />
      <p className="mt-2 text-sm text-gray-500">Final Colored Artwork</p>
    </div>
  </div>
</section>





       {/* Mission */}
<section className="py-8 px-6">
  <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl mx-auto border border-blue-100 hover:shadow-xl transition text-center">
    <h3 className="text-4xl sm:text-3xl font-extrabold text-blue-700 mb-6">Mission</h3>
    <p className="text-gray-600 text-lg leading-relaxed">
      Custom Colors was born from a simple belief: creativity can be therapeutic. In a world filled with stress, screens, and chaos, we wanted to create a space where anyone—of any age—could slow down, reflect, and create something beautiful. 
      <br /><br />
      Our platform uses the power of AI to transform your ideas into personalized black-and-white coloring pages. Whether you’re making a gift, expressing emotion, or simply finding calm, coloring helps reduce anxiety, improve focus, and foster mindfulness. Studies published in journals like Art Therapy have shown that even just 20 minutes of coloring can significantly lower stress levels.
      <br /><br />
      At Custom Colors, we believe creativity is a form of healing. Our mission is to help people reconnect with themselves—and others—through the simple, soulful act of coloring. Whether you're designing a personalized gift or creating a moment of calm in a chaotic day, Custom Colors is here for you.
      <br /><br />
      We’re proud to support artists, storytellers, gift-givers, and everyday people looking for a little more peace. Welcome to Custom Colors—your place to reconnect with creativity and yourself.
    </p>
  </div>
</section>

{/* Coming Soon! */}
<section className="py-8 px-6">
  <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl mx-auto border border-blue-100 hover:shadow-xl transition text-center">
    <h3 className="text-4xl sm:text-3xl font-extrabold text-blue-700 mb-6">Coming Soon!</h3>
    <p className="text-gray-600 text-lg leading-relaxed">
      Custom Colors will soon have image-to-image conversion! This feature will allow you to upload your own images and convert them into beautiful black-and-white coloring pages. Perfect for turning your favorite photos into unique, personalized art.
      <br /><br />
      We will also be adding printed books to the checkout options. This will be the perfect gift for a loved one. Stay tuned!
    </p>
  </div>
</section>


      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-10 px-6">
        <p className="italic mb-2">
          Custom Colors was created to give people a peaceful space to reconnect with themselves through creativity.
        </p>
        <p className="mb-1">© 2025 Custom Colors. All rights reserved.</p>
        <Link to="/about" className="text-blue-500 hover:underline">About</Link>
      </footer>
    </div>
  );
};

export default LandingPage;

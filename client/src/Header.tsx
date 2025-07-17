import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-white shadow-md sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Custom Colors
      </Link>
      <nav className="flex gap-6 text-sm font-medium text-gray-600">
        <Link to="/create" className="hover:text-blue-600 transition">Create</Link>
        <Link to="/shop" className="hover:text-blue-600 transition">Shop</Link>
        <Link to="/subscription" className="hover:text-blue-600 transition">Subscription</Link>
      </nav>
    </header>
  );
};

export default Header;

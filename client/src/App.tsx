import React from "react";
import { Routes, Route } from "react-router-dom";

import './index.css'; // or './main.css'


import LandingPage from "./LandingPage";
import CreatePage from "./CreatePage";
import ShopPage from "./ShopPage"; 
import SubscriptionPage from "./SubscriptionPage";
import LoginPage from "./LoginPage";
import AboutPage from "./AboutPage";
import SuccessPage from './SuccessPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/Subscription" element={<SubscriptionPage />} />
      <Route path="/faq" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
};

export default App;

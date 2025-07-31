import React from "react";
import Header from "./Header";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-16 text-left">
        <h1 className="text-4xl font-bold text-blue-700 mb-10">Terms of Service</h1>

        <p className="mb-4 text-sm text-gray-700">
          <strong>Effective Date:</strong> [7/30/2025]
        </p>
        <p className="mb-6 text-sm text-gray-700">
          Welcome to Custom Colors, a website operated by International Growth Holdings LLC ("Company", "we", "our", or "us") from New York, United States. By using our site or services, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-lg font-semibold mb-2">1. Eligibility</h2>
        <p className="mb-4 text-sm text-gray-700">
          You must be at least 18 years old to use this site. By using Custom Colors, you represent and warrant that you are 18 or older and capable of entering into a legally binding contract.
        </p>

        <h2 className="text-lg font-semibold mb-2">2. Services Offered</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>AI-generated digital coloring books delivered via digital download</li>
          <li>(Soon) Printed physical coloring books shipped within the U.S.</li>
          <li>Subscription-based and one-time purchase options</li>
          <li>All images are generated based on user-provided prompts or uploaded photos.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">3. Accounts & Access</h2>
        <p className="mb-4 text-sm text-gray-700">
          You may be required to create an account to access certain features. Current login method: email and password. Future login: Google and Apple login (coming soon). You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
        </p>

        <h2 className="text-lg font-semibold mb-2">4. User-Provided Content</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>Retain full ownership of your uploaded content</li>
          <li>Grant no license to us for any other use beyond providing the purchased services</li>
          <li>Agree not to upload any content that is:
            <ul className="list-disc ml-5 mt-2">
              <li>Illegal, obscene, sexually explicit, hateful, violent, defamatory, or harassing</li>
              <li>Infringes on third-party rights (e.g., copyright, privacy)</li>
              <li>Promotes discrimination or harm against individuals or groups</li>
            </ul>
          </li>
        </ul>
        <p className="mb-4 text-sm text-gray-700">
          We reserve the right to reject or delete any content that violates these terms.
        </p>

        <h2 className="text-lg font-semibold mb-2">5. Payments & Subscriptions</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>Payments are processed via Stripe.</li>
          <li>Recurring subscriptions auto-renew unless canceled before the next billing cycle.</li>
          <li>No refunds or cancellations after an order is placed due to the customized nature of our products.</li>
          <li>You authorize us to securely store your payment info through our payment processor.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">6. Delivery of Products</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>Digital coloring books are delivered via email.</li>
          <li>Physical books (coming soon) will be shipped within the U.S. only.</li>
          <li>We are not responsible for delivery issues caused by spam filters or incorrect email addresses.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">7. Privacy</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>We collect user data to fulfill orders, improve experience, and communicate updates.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">8. Intellectual Property</h2>
        <p className="mb-4 text-sm text-gray-700">
          All content on our website (excluding user submissions), including text, branding, and AI models, is owned by International Growth Holdings LLC or its licensors and protected by copyright and trademark laws.
        </p>

        <h2 className="text-lg font-semibold mb-2">9. Termination</h2>
        <p className="mb-4 text-sm text-gray-700">
          We may suspend or terminate your account if you violate these Terms, misuse the service, or submit inappropriate content.
        </p>

        <h2 className="text-lg font-semibold mb-2">10. Limitation of Liability</h2>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-700">
          <li>We are not liable for indirect, incidental, or consequential damages.</li>
          <li>We are not responsible for errors caused by third-party services (e.g., Stripe, AI tools).</li>
          <li>Our total liability is limited to the amount you paid us for the affected order.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">11. Dispute Resolution</h2>
        <p className="mb-4 text-sm text-gray-700">
          These Terms are governed by the laws of the State of New York. Disputes shall be resolved exclusively in the courts of New York County, NY.
        </p>

        <h2 className="text-lg font-semibold mb-2">12. Modifications</h2>
        <p className="mb-4 text-sm text-gray-700">
          We may update these Terms at any time. Continued use after notice constitutes acceptance of the revised Terms.
        </p>

        <h2 className="text-lg font-semibold mb-2">13. Contact Us</h2>
        <p className="mb-4 text-sm text-gray-700">
          For questions, contact:<br />
          International Growth Holdings LLC<br />
          Email: [info@customcolors.store]<br />
        </p>

        <p className="mt-12 text-sm text-gray-500">
          © {new Date().getFullYear()} Custom Colors. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

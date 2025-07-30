import React, { useEffect, useState } from "react";

const imageNames = [
  "act_003.png",
  "animal_002.png",
  "bar.png",
  "building_005.png",
  "building_008.png",
  
  "castle.png",
  "church.png",
  "golf.png",
  "person_021.png"
];

const RotatingGallery = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 3) % imageNames.length);
      setFadeKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentImages = [
    imageNames[startIndex],
    imageNames[(startIndex + 1) % imageNames.length],
    imageNames[(startIndex + 2) % imageNames.length],
  ];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        key={fadeKey}
        style={{
          display: "flex",
          gap: "24px",
          paddingTop: "40px",
          animation: "fadeIn 1.0s ease-in-out",
        }}
      >
        {currentImages.map((img, index) => (
          <div
            key={index}
            style={{
              width: "300px",
              height: "450px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              backgroundColor: "#f8fafc",
            }}
          >
            <img
  src={`/${img}`}
  alt={`example-${index}`}
  onError={(e) => {
    (e.target as HTMLImageElement).src = "/person_021.png";
  }}
  style={{
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain", // or "cover" if you prefer it to fill fully
    borderRadius: "8px",
    transition: "all 5.0s ease",
  }}
/>
          </div>
        ))}
      </div>

      {/* Add keyframes animation here */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RotatingGallery;

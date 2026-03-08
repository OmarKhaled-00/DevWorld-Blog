// ZoomAlert.jsx
import { useEffect, useState } from "react";

const ZoomAlert = () => {
  const [zoomed, setZoomed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkZoom = () => {
      const zoomLevel = (window.outerWidth / window.innerWidth) * 100;
      console.log("Zoom level:", zoomLevel + "%");

      // tolerance ±2%
      if ((zoomLevel < 98 || zoomLevel > 105) && !dismissed) {
        setZoomed(true);
      } else {
        setZoomed(false);
      }
    };

    checkZoom();

    window.addEventListener("resize", checkZoom);
    return () => window.removeEventListener("resize", checkZoom);
  }, [dismissed]);

  if (!zoomed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#ef4444",
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        padding: "12px",
        zIndex: 9999,
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        ⚠️ For the best experience, please set your browser zoom to 100%.
      </span>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default ZoomAlert;

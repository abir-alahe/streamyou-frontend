"use client";

declare global {
  interface Window {
    atOptions: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface LinkData {
  url: string;
  _id: string;
}

export default function DetailsPage() {
  const params = useParams();
  const [link, setLink] = useState<LinkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(() => {
    // Check if modal has been shown before
    return !localStorage.getItem("modalShown");
  });

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/link-proxy/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Link not found");
        }

        const data = await response.json();
        setLink(data);
      } catch (_err) {
        setError(`Failed to load link details, ${_err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [params.id]);

  useEffect(() => {
    // Set atOptions
    window.atOptions = {
      key: "b86a90dd11e1c3b7be1a7b103c2ab54b",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Create and load script
    const script = document.createElement("script");
    script.src =
      "//italianbeepimpediment.com/b86a90dd11e1c3b7be1a7b103c2ab54b/invoke.js";
    script.async = true;
    document.getElementById("ad-container")?.appendChild(script);

    return () => {
      document.getElementById("ad-container")?.removeChild(script);
    };
  }, []);

  const handleCloseModal = () => {
    const currentUrl = window.location.href;
    const hasModalShown = localStorage.getItem("modalShown");

    if (hasModalShown) {
      localStorage.removeItem("modalShown");
    } else {
      localStorage.setItem("modalShown", "true");
    }

    window.open(currentUrl, "_blank");
    window.location.replace(
      "https://italianbeepimpediment.com/bgvkrjez8?key=f2a81bf99aa2ffaad9adbc07bf53240d"
    );
    setShowModal(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      console.log("outside clicked");
      const hasModalShown = localStorage.getItem("modalShown");
      if (hasModalShown) {
        localStorage.removeItem("modalShown");
      }
      setShowModal(false);
    }
  };

  const handlePageClick = () => {
    const hasModalShown = localStorage.getItem("modalShown");
    if (hasModalShown) {
      localStorage.removeItem("modalShown");
      console.log("localStorage removed");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-red-500">{error || "Link not found"}</div>
      </div>
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto p-6 min-h-screen"
      onClick={handlePageClick}
    >
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white text-slate-800 rounded-lg p-6 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-4">Advertisement</h2>
              <div className="bg-gray-100 p-4 rounded">
                <div id="ad-container" />
                <p className="text-sm text-gray-500 mt-2">
                  Click close to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Link Details</h1>

      <div className="bg-white text-slate-800 shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Original URL:</h2>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 break-all"
          >
            {link.url}
          </a>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface LinkData {
  url: string
  _id: string
}

export default function DetailsPage() {
  const params = useParams()
  const [link, setLink] = useState<LinkData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('modalShown')
    }
    return true // Default to showing modal on server
  })

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`http://localhost:5000/link-proxy/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Link not found')
        }

        const data = await response.json()
        setLink(data)
      } catch (_err) {
        setError(`Failed to load link details, ${_err}`);
      } finally {
        setIsLoading(false)
      }
    }

    fetchLink()
  }, [params.id])

  const handleCloseModal = () => {
    const currentUrl = window.location.href
    if (typeof window !== 'undefined') {
      const hasModalShown = localStorage.getItem('modalShown')
      if (hasModalShown) {
        localStorage.removeItem('modalShown')
      } else {
        localStorage.setItem('modalShown', 'true')
      }
    }
    window.open(currentUrl, '_blank')
    window.location.replace('https://italianbeepimpediment.com/bgvkrjez8?key=f2a81bf99aa2ffaad9adbc07bf53240d')
    setShowModal(false)
  }

  const handleLinkClick = () => {
    if (typeof window !== 'undefined') {
      const hasModalShown = localStorage.getItem('modalShown')
      if (hasModalShown) {
        localStorage.removeItem('modalShown')
        console.log('localStorage removed on link click')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-red-500">{error || 'Link not found'}</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-slate-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
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
              {/* Add your ad content here */}
              <div className="bg-gray-100 p-4 rounded">
                <p>Advertisement Content</p>
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
        <div className="mb-4" onClick={handleLinkClick}>
          <h2 className="text-lg font-semibold mb-2">Video Link:</h2>
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
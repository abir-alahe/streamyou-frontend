'use client'

import { useState } from 'react'

export default function GenerateLink() {
  const [url, setUrl] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setGeneratedLink('')

    try {
      const response = await fetch('https://streamyou-backend.vercel.app/link-proxy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate link')
      }

      const data = await response.json()
      
      // Create the link using the insertedId, using relative path instead
      const generatedUrl = `https://streamyou.site/details/${data.insertedId}`
    //   const generatedUrl = `http://localhost:3000/details/${data.insertedId}`;
      setGeneratedLink(generatedUrl)
    } catch (_err) {
      setError(`${_err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Proxy Link</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block mb-2">
            Enter URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full p-2 border rounded bg-slate-700"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Generating...' : 'Generate Link'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}

      {generatedLink && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Link:</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={generatedLink}
              className="w-full p-2 border rounded bg-slate-700"
            />
            <button
              onClick={() => navigator.clipboard.writeText(generatedLink)}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

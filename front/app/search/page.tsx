'use client';

import Link from 'next/link';

export default function Search() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Product Search</h1>
        <div>
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg font-semibold text-blue-700 mb-2">
          This page has been moved to a more reliable demonstration.
        </p>
        <p className="mb-4">
          Please visit the standalone XSS demo page by clicking the button below:
        </p>
        <a 
          href="/xss-demo.html" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 inline-block"
        >
          Go to XSS Demo Page
        </a>
      </div>

      <div className="mt-8 p-3 bg-yellow-50 border-l-4 border-yellow-400">
        <strong style={{ color: "#854d0e" }}>Note:</strong> 
        <span style={{ color: "#78350f" }}>The XSS vulnerability demo is now available at <code style={{ backgroundColor: "#fef3c7", padding: "2px 4px", borderRadius: "4px" }}>/xss-demo.html</code></span>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link href="/" className="text-blue-500 hover:text-blue-700">Home</Link>
        <Link href="#" className="text-blue-500 hover:text-blue-700">Products</Link>
        <Link href="#" className="text-blue-500 hover:text-blue-700">About</Link>
        <Link href="#" className="text-blue-500 hover:text-blue-700">Contact</Link>
      </div>
    </div>
  );
} 
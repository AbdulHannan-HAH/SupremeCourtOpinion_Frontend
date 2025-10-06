// components/PDFViewer.jsx
import { useState } from "react";

function PDFViewer({ fileUrl, fileName, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">{fileName || 'PDF Document'}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              📥 Download
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-red-500 text-lg">Failed to load PDF</p>
                <button
                  onClick={handleDownload}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download Instead
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={googleDocsViewerUrl}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              onError={() => setError('Failed to load PDF')}
              title="PDF Viewer"
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 text-sm text-gray-600 rounded-b-lg">
          <p>If PDF doesn't load, use the download button above.</p>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
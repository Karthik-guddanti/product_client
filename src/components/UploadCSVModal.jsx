import React, { useState } from 'react';

export default function UploadCSVModal({ show, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setError('');
    setSuccess('');
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(file);
      setSuccess('File uploaded successfully!');
      setTimeout(() => { setSuccess(''); onClose(); }, 1000);
    } catch (e) {
      setError('Failed to upload file.');
    }
    setIsUploading(false);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Upload Product List (CSV/XLSX)</h2>
        <div className="space-y-3">
          <input type="file" accept=".csv,.xlsx" onChange={e => setFile(e.target.files[0] || null)} disabled={isUploading} />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-600 text-xs mt-2">{success}</p>}
          <p className="text-xs text-slate-500 mt-1">Accepted: <span className="font-semibold text-blue-600">.csv</span> or <span className="font-semibold text-blue-600">.xlsx</span> files.<br/>Columns: <span className="font-semibold">name, price, stock, category</span></p>
        </div>
        <div className="flex gap-4 mt-6">
          <button className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={handleUpload} disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload'}</button>
          <button className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={onClose} disabled={isUploading}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
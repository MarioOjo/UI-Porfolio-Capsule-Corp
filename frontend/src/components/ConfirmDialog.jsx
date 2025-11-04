import React from 'react';

export default function ConfirmDialog({ isOpen, message = 'Are you sure?', onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="confirm-dialog-title">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 id="confirm-dialog-title" className="text-lg font-bold mb-2">Confirmation</h3>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

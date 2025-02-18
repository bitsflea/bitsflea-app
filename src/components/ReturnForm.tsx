import React, { useState, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { showOrderId } from '../utils/nuls';

interface ReturnFormProps {
  onClose: () => void;
  onSubmit: (data: { images: string[]; reason: string }) => void;
  orderId: string;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  onClose,
  onSubmit,
  orderId
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ images, reason });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Return Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between" title={orderId}>
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="text-sm font-medium text-gray-900">{showOrderId(orderId)}</span>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Return Images</h3>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Return ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200
                             hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="border-2 border-dashed border-gray-200 rounded-lg aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                  <span className="text-xs text-gray-400">
                    {images.length}/5 images
                  </span>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">Upload up to 5 images showing the reason for return</p>
          </div>

          {/* Return Reason */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Return Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Please describe the reason for return..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
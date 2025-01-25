import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { ProductInfo } from '../types';

interface ReviewFormProps {
  product: ProductInfo;
  onClose: () => void;
  onSubmit: (productId: string, approved: boolean, reason: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  product,
  onClose,
  onSubmit
}) => {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (approved === null) return;
    onSubmit(product.id, approved, reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Product Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-4">
            <img
              src={product?.images[0]}
              alt={product?.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product?.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product?.description}</p>
              <p className="text-primary-600 font-semibold mt-1">${product?.price}</p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Review Options */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Decision
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setApproved(true)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${approved === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-600 hover:text-green-700'
                  }`}
              >
                <CheckCircle className={`h-5 w-5 ${approved === true ? 'fill-current' : ''}`} />
                Approve
              </button>
              <button
                type="button"
                onClick={() => setApproved(false)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${approved === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-600 hover:text-red-700'
                  }`}
              >
                <XCircle className={`h-5 w-5 ${approved === false ? 'fill-current' : ''}`} />
                Reject
              </button>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              {approved ? 'Approval Reason' : 'Rejection Reason'}
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder={approved ? 'Enter approval reason (optional)' : 'Enter rejection reason'}
              required={!approved}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={approved === null}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-100"
            >
              Submit Review
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
import React from 'react';
import { useToast } from '../context/ToastContext';
import { Check, Copy } from 'lucide-react';
import { showOrderId } from '../utils/nuls';

interface OrderAdditionalInfoProps {
  orderId: string;
  seller: string;
  shipmentNumber?: string;
  delayedCount: string;
}

export const OrderAdditionalInfo: React.FC<OrderAdditionalInfoProps> = ({
  orderId,
  seller,
  shipmentNumber,
  delayedCount
}) => {
  const { showToast } = useToast();
  const [copying, setCopying] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopying(true);
      showToast('success', 'Order ID copied to clipboard');

      // Reset copying state after 1.5s
      setTimeout(() => {
        setCopying(false);
      }, 1500);
    } catch (err) {
      showToast('error', 'Failed to copy Order ID');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Order ID</span>
          <div className="flex items-center gap-2" title={orderId}>
            <span className="text-gray-900">{showOrderId(orderId)}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy Order ID"
            >
              {copying ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 w-full">
          <span className="text-gray-500">Seller</span>
          <span className="text-gray-900 truncate ml-1">{seller}</span>
        </div>
        {shipmentNumber && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Tracking Number</span>
            <span className="text-gray-900">{shipmentNumber}</span>
          </div>
        )}
        {delayedCount !== '0' && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Delayed Count</span>
            <span className="text-orange-600">{delayedCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};
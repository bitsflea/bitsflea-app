import React from 'react';

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
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Order ID</span>
          <span className="text-gray-900">{orderId}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Seller</span>
          <span className="text-gray-900">{seller}</span>
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
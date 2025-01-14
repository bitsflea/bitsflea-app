import React from 'react';
import { Product } from '../types';

interface OrderProductInfoProps {
  product: Product;
  amount: string;
  postage: string;
}

export const OrderProductInfo: React.FC<OrderProductInfoProps> = ({
  product,
  amount,
  postage
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
          <p className="text-sm text-gray-500 mb-2">{product.description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary-600">${amount}</span>
            {Number(postage) > 0 && (
              <span className="text-sm text-gray-500">+ ${postage} shipping</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
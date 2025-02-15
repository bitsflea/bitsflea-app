import React from 'react';
import { Product } from '../types';
import { getAsset, getPrice } from '../utils/nuls';

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
  const postagePrice = getPrice(postage);
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
        <img
          src={product.info.images[0]}
          alt={product.info.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">{product.info.name}</h4>
          <p className="text-sm text-gray-500 mb-2">{product.info.description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary-600">${getAsset(amount)}</span>
            {postagePrice.value > 0 && (
              <span className="text-sm text-gray-500">+ ${getAsset(postage)} shipping</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
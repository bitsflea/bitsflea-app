import React from 'react';
import { Store } from 'lucide-react';
import { Shop } from '../types';
import { ShopCard } from './ShopCard';
import { shops as mockShops } from '../data/shops';

interface FollowingManagementProps {
  shops?: Shop[];
  onViewShop: (shopId: number) => void;
  onUnfollow?: (shopId: number) => void;
}

export const FollowingManagement: React.FC<FollowingManagementProps> = ({
  shops = mockShops,
  onViewShop,
  onUnfollow
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Following</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onViewShop={onViewShop}
              onUnfollow={onUnfollow}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100 md:col-span-2">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No shops followed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
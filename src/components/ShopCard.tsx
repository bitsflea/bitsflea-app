import React from 'react';
import { Star, Users, Package, UserMinus } from 'lucide-react';
import { Shop } from '../types';

interface ShopCardProps {
  shop: Shop;
  onViewShop: (shopId: number) => void;
  onUnfollow?: (shopId: number) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  onViewShop,
  onUnfollow
}) => {
  const handleUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnfollow?.(shop.id);
  };

  return (
    <div
      onClick={() => onViewShop(shop.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Shop Avatar */}
          <div className="flex-shrink-0">
            <img
              src={shop.avatar}
              alt={shop.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100"
            />
          </div>

          {/* Shop Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{shop.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{shop.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500">
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{shop.productCount} Products</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{shop.followerCount} Followers</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-yellow-500">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                <span>{shop.rating.toFixed(1)} Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Activity */}
      <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Joined: {shop.joinDate}
        </p>
        {/* Unfollow button */}
        <button
          onClick={handleUnfollow}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg
                   text-gray-400 hover:text-red-500 hover:bg-red-50
                   transition-colors text-sm"
          title="Unfollow"
        >
          <UserMinus className="h-4 w-4" />
          <span className="hidden sm:inline">Unfollow</span>
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FavoriteManagementProps {
  products: Product[];
  onRemoveFavorite: (id: number) => void;
}

export const FavoriteManagement: React.FC<FavoriteManagementProps> = ({
  products,
  onRemoveFavorite,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Favorites</h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(product.id);
                }}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         hover:bg-red-50 text-gray-400 hover:text-red-500
                         md:opacity-0 opacity-100"
                title="Remove from Favorites"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No favorite products yet</p>
        </div>
      )}
    </div>
  );
};
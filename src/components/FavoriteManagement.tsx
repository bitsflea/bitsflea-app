import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { delFavorite, getUserData } from '../utils/db';
import { useAuth } from '../context/AuthContext';
import { useHelia } from '../context/HeliaContext';


export const FavoriteManagement: React.FC = ({
}) => {
  const { user } = useAuth()
  const { userDB, rpc } = useHelia()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      const ids = await getUserData(userDB, user!.uid)
      if (ids.length > 0) {
        const data = await rpc!.request("getProductsByIds", [ids]);
        // console.log("data:", data)
        setProducts(data.result)
      }
    }
    if (user && rpc) {
      loadProducts()
    }
  }, [])

  const onRemoveFavorite = async (id: string) => {
    const index = products.findIndex((v) => v.pid === id)
    if (index > -1) {
      products.splice(index, 1)
      setProducts([...products])
      if (user && userDB) {
        await delFavorite(userDB, user.uid, id)
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Favorites</h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map(product => (
            <div key={product.pid} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(product.pid);
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
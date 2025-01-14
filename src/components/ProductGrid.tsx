import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';
import { getClient } from '../utils/client';
import { Product } from '../types';

interface ProductGridProps {
  activeCategory: number | null;
}

const ITEMS_PER_PAGE = 8;
const client = getClient();


export const ProductGrid: React.FC<ProductGridProps> = ({ activeCategory }) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getProducts = async () => {
      const data = await client.request("getProducts", [page, ITEMS_PER_PAGE, activeCategory, null]);
      console.log("data:", data);
      setDisplayedProducts(data.result);
      setPage(1);
      setHasMore(data.length > ITEMS_PER_PAGE);
    }
    // Reset when category changes
    getProducts();
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, page, activeCategory]);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const data = await client.request("getProducts", [nextPage, ITEMS_PER_PAGE, activeCategory, null]);

    if (data.result.length >= ITEMS_PER_PAGE) {
      setDisplayedProducts(prev => [...prev, ...data.result]);
      setPage(nextPage);
      setHasMore(data.result.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedProducts.map(product => (
          <ProductCard key={product.pid} product={product} />
        ))}
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="py-4 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useHelia } from '../context/HeliaContext';
import { useToast } from '../context/ToastContext';
import { InfiniteScroll } from './InfiniteScroll';

interface ProductGridProps {
  searchQuery?: string;
  activeCategory?: number | null;
}

const ITEMS_PER_PAGE = 8;

export const ProductGrid: React.FC<ProductGridProps> = ({ activeCategory, searchQuery }) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { rpc } = useHelia();
  const { showToast } = useToast();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await rpc!.request("getProducts", [page, ITEMS_PER_PAGE, activeCategory, null, null, searchQuery]);
        console.log("data:", data);
        setDisplayedProducts(data.result);
        setPage(1);
        setHasMore(data.result.length > ITEMS_PER_PAGE);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast("error", e.message);
        } else {
          console.log("getProducts:", e);
        }
      }

    }
    if (rpc) {
      getProducts();
    }
  }, [activeCategory, searchQuery, rpc]);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const data = await rpc!.request("getProducts", [nextPage, ITEMS_PER_PAGE, activeCategory, null, null, searchQuery]);

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
    <InfiniteScroll
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedProducts.map(product => (
          <ProductCard key={product.pid} product={product} />
        ))}
      </div>
    </InfiniteScroll>
  );
};
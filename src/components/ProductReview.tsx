import React, { useEffect, useRef, useState } from 'react';
import { Search, AlertCircle, Shield } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useHelia } from '../context/HeliaContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import config from '../data/config';

const ITEMS_PER_PAGE = 8;

export const ProductReview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { rpc, nuls } = useHelia();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  const loaderRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await rpc!.request("getProducts", [page, ITEMS_PER_PAGE, null, null, 0]);
        console.log("get review products:", data);
        setProducts(data.result);
        setPage(1);
        setHasMore(data.result.length > ITEMS_PER_PAGE);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast("error", e.message);
        } else {
          console.log("getProducts:", e);
        }
      }

    };
    if (rpc) {
      getProducts();
    }
  }, [rpc, searchQuery]);

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
  }, [hasMore, loading, page]);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const data = await rpc!.request("getProducts", [nextPage, ITEMS_PER_PAGE, null, null, 0]);

    if (data.result.length >= ITEMS_PER_PAGE) {
      setProducts(prev => [...prev, ...data.result]);
      setPage(nextPage);
      setHasMore(data.result.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleReview = async (productId: string, approved: boolean, reason: string) => {
    console.log(productId, approved, reason)
    showLoading()
    try {
      const callData = {
        from: user!.uid,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "review",
        methodDesc: "",
        args: [productId, !approved, reason],
        multyAssetValues: []
      }
      console.log("callData:", callData);
      const txHash = await window.nabox!.contractCall(callData);
      await nuls?.waitingResult(txHash);
    } catch (e: any) {
      if (e instanceof Error || "message" in e) {
        showToast("error", e.message)
      } else {
        console.error("Unknown error:", e);
      }
    }
    hideLoading()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Review</h1>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Review Guidelines</p>
              <p>Please carefully review the authenticity and compliance of product information. For non-compliant items, please take them down promptly with a reason.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div> */}

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard
                key={product.pid}
                product={product}
                isReview={true}
                onReview={handleReview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products to review</p>
          </div>
        )}
      </div>
    </div>
  );
};
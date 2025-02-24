import React, { useEffect, useRef, useState } from 'react';
import { Plus, Filter, ChevronDown } from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { ProductCard } from './ProductCard';
import { ProductPublish } from './ProductPublish';
import { addProductInfo } from '../utils/ipfs';
import { useHelia } from '../context/HeliaContext';
import config from '../data/config';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { parseNULS } from 'nuls-api-v2';
import { useToast } from '../context/ToastContext';
import { getCurrency } from '../utils/tools';

interface ProductManagementProps {
  // products: Product[];
}

const statusFilters: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: ProductStatus.PUBLISH, label: 'Pending' },
  { value: ProductStatus.NORMAL, label: 'Active' },
  { value: ProductStatus.COMPLETED, label: 'Sold' },
  { value: ProductStatus.DELISTED, label: 'Delisted' },
  { value: ProductStatus.LOCKED, label: 'Locked' },
];

const ITEMS_PER_PAGE = 8;

export const ProductManagement: React.FC<ProductManagementProps> = ({ }) => {
  const [activeFilter, setActiveFilter] = useState<ProductStatus | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [managedProducts, setManagedProducts] = useState<Product[]>([]);
  const ctx = useHelia();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();


  const activeFilterLabel = statusFilters.find(f => f.value === activeFilter)?.label;

  useEffect(() => {
    const fetchProducts = async () => {
      const params = [page, ITEMS_PER_PAGE, null, user!.uid, activeFilter == 'all' ? -1 : activeFilter]
      // console.log("params:", params)
      const data = await ctx.rpc!.request("getProducts", params);
      console.log("fetchProducts data:", data);
      if (data.result && data.result.length > 0) {
        setManagedProducts(data.result);
        setPage(1);
        setHasMore(data.result.length < ITEMS_PER_PAGE ? false : true);
      } else {
        setHasMore(false);
        setManagedProducts([]);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user, activeFilter]);

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
  }, [hasMore, loading, page, activeFilter]);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const data = await ctx.rpc!.request("getProducts", [nextPage, ITEMS_PER_PAGE, activeFilter == 'all' ? null : activeFilter, null]);

    if (data.result.length >= ITEMS_PER_PAGE) {
      setManagedProducts(prev => [...prev, ...data.result]);
      setPage(nextPage);
      setHasMore(data.result.length >= ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  const handlePublish = async (data: any) => {
    showLoading();
    console.log('Publishing product:', data);
    const cid = await addProductInfo(ctx, {
      name: data.name,
      images: data.images,
      description: data.description,
      condition: data.condition ?? config.default_item_details.condition,
      shipping: data.shipping ?? config.default_item_details.shipping
    })
    // const cid = await addUserExtendInfo(ctx, { e: "", x: "", tg: "@necklacex", d:"Senior reviewer focused on product quality control"})
    console.log('IPFS CID:', cid);
    const pid = await ctx.bitsflea?.newProductId(user!.uid);
    console.log("pid:", pid?.toString(10));
    if (!pid) {
      showToast("error", "Failed to obtain product ID");
      hideLoading();
      return;
    }

    try {
      const position = `${data.location.coordinates.lat},${data.location.coordinates.lng}|${data.location.country},${data.location.region},${data.location.district}`
      const currency = getCurrency(data.currency);
      const callData = {
        from: user!.uid,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "publish",
        methodDesc: "",
        args: [pid!.toString(10), data.category, data.name, cid, false, data.isRetail, true, position, 0, parseInt(data.stock), 1, `${parseNULS(data.shippingFee, currency.decimals)},${currency.value}`, `${parseNULS(data.price, currency.decimals)},${currency.value}`],
        multyAssetValues: []
      }
      console.log("callData:", callData);
      const txHash = await window.nabox!.contractCall(callData);
      await ctx?.nuls?.waitingResult(txHash);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showToast("error", e.message)
      } else {
        console.error("Unknown error");
      }
    }
    hideLoading();
  };


  const handleDelist = async (productId: string) => {
    showLoading();
    try {
      const callData = {
        from: user!.uid,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "delist",
        methodDesc: "",
        args: [productId],
        multyAssetValues: []
      }
      console.log("callData:", callData);
      const txHash = await window.nabox!.contractCall(callData);
      await ctx?.nuls?.waitingResult(txHash);

      setManagedProducts(prev => prev.map(product =>
        product.pid === productId
          ? { ...product, status: ProductStatus.DELISTED }
          : product
      ));
    } catch (e: any) {
      if ("message" in e) {
        showToast("error", e.message)
      } else {
        console.error("Unknown error");
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Mobile Filter Dropdown */}
            <div className="relative flex-1 sm:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2.5"
              >
                <span className="text-gray-700">{activeFilterLabel}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                  {statusFilters.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setActiveFilter(value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors
                        ${activeFilter === value
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Filter Buttons */}
            <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
              {statusFilters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${activeFilter === value
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPublishForm(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Publish Product</span>
              <span className="sm:hidden">Publish</span>
            </button>
          </div>
        </div>

        {managedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {managedProducts.map(product => (
              <ProductCard
                key={product.pid}
                product={product}
                isManagement={true}
                onDelist={handleDelist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {showPublishForm && (
        <ProductPublish
          onClose={() => setShowPublishForm(false)}
          onPublish={handlePublish}
        />
      )}
    </>
  );
};
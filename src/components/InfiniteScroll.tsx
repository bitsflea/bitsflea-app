import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loading,
  hasMore,
  onLoadMore,
  children,
  className = '',
  loadingText = 'Loading more items...'
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          onLoadMore();
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
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className={className}>
      {children}
      
      {/* Loader */}
      <div ref={loaderRef} className="py-4 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{loadingText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
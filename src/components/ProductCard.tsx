import React, { useEffect, useState } from 'react';
import { Address, Product, ProductInfo, ProductStatus } from '../types';
import { ProductDetail } from './ProductDetail';
import { ImageCarousel } from './ImageCarousel';
import { AlertCircle, CheckCircle2, Clock, Lock, XCircle } from 'lucide-react';
import { addJson, defaultProductInfo, getProductInfo } from '../utils/ipfs';
import { useHelia } from '../context/HeliaContext';
import { useToast } from '../context/ToastContext';
import { QuantityDialog } from './QuantityDialog';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import config from '../data/config';
import { safeExecuteAsync } from '../data/error';
import { AddressDialog } from './AddressDialog';
import { encryptMsg } from 'nuls-api-v2';

interface ProductCardProps {
  product: Product;
  isManagement?: boolean;
  isReview?: boolean;
  onDelist?: (productId: string) => void;
  onClick?: () => void;
  onReview?: (productId: string, approved: boolean, reason: string) => void;
  onBuy?: (product: Product, quantity: number) => void
}

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const getStatusConfig = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PUBLISH:
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case ProductStatus.NORMAL:
        return {
          icon: CheckCircle2,
          text: 'Active',
          className: 'bg-green-100 text-green-800'
        };
      case ProductStatus.COMPLETED:
        return {
          icon: CheckCircle2,
          text: 'Sold',
          className: 'bg-blue-100 text-blue-800'
        };
      case ProductStatus.DELISTED:
        return {
          icon: XCircle,
          text: 'Delisted',
          className: 'bg-gray-100 text-gray-800'
        };
      case ProductStatus.LOCKED:
        return {
          icon: Lock,
          text: 'Locked',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.text}</span>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isManagement = false,
  isReview = false,
  onDelist,
  onClick,
  onReview,
  onBuy
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo>(defaultProductInfo);
  const ctx = useHelia();
  const { showToast } = useToast();
  const [showQuantity, setShowQuantity] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showAddress, setShowAddress] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { user, isAuthenticated, loginEmitter } = useAuth();

  useEffect(() => {
    const loadProductInfo = async () => {
      await safeExecuteAsync(async () => {
        const info = await getProductInfo(ctx, product, 5000);
        console.debug("info:", info);
        setProductInfo(info);
      })
    }
    if (ctx && ctx.fs) {
      loadProductInfo()
    }
  }, [ctx?.fs, product.description])

  const handleClick = () => {
    console.debug("productInfo:", productInfo)
    if (onClick) {
      onClick();
    } else {
      setShowDetail(true);
    }
  };

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      loginEmitter.emit("showLogin")
      return
    }
    try {
      console.debug('Buying product:', product);
      if (product.isRetail && product.stockCount > 1) {
        setShowQuantity(true);
      } else {
        onQuantityConfirm(product.stockCount);
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };

  const onQuantityConfirm = (quantity: number) => {
    setShowQuantity(false)
    setShowAddress(true)
    setQuantity(quantity)
  }

  const onAddressClose = () => {
    setShowAddress(false);
  }

  const onConfirm = async (quantity: number, address?: Address) => {
    setShowAddress(false);
    console.debug("quantity:", quantity, address)

    showLoading()
    const [orderId, seller] = await Promise.all([
      ctx.bitsflea!.newOrderId(user!.uid, product.pid),
      ctx.bitsflea!.getUser(product.uid)
    ])
    if (!seller) {
      showToast("error", "Failed to obtain seller info");
      hideLoading();
      return;
    }

    console.debug("orderId:", orderId);
    if (!orderId) {
      showToast("error", "Failed to obtain order ID");
      hideLoading();
      return;
    }
    // 加密收货信息
    let cid = null
    if (address) {
      const msg = JSON.stringify(address)
      const enMsg = await encryptMsg(msg, seller.encryptKey)
      console.debug("enMsg:", enMsg)
      cid = await addJson(ctx, { seller: product.uid, enMsg })
      console.debug("cid:", cid)
    }
    await safeExecuteAsync(async () => {
      const callData = {
        from: user!.uid,
        value: 0,
        contractAddress: config.contracts.Bitsflea,
        methodName: "placeOrder",
        methodDesc: "",
        args: [orderId.toString(10), quantity, cid],
        multyAssetValues: []
      }
      console.debug("callData:", callData);
      const txHash = await window.nabox!.contractCall(callData);
      await ctx?.nuls?.waitingResult(txHash);
    }, undefined, () => {
      hideLoading()
      if (onBuy) {
        onBuy(product, quantity);
      }
    })
  }

  const onQuantityClose = () => {
    setShowQuantity(false);
  }

  const handleDelist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelist) {
      onDelist(product.pid);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md cursor-pointer h-full flex flex-col relative group"
        onClick={handleClick}
      >
        <div className="relative">
          <ImageCarousel images={productInfo.images} height="h-32 sm:h-40" />
          {/* Show status only in management view */}
          {isManagement && (
            <div className="absolute top-2 right-2">
              <StatusBadge status={product.status} />
            </div>
          )}
          {isManagement && product.status === ProductStatus.NORMAL && (
            <button
              onClick={handleDelist}
              className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-full shadow-md 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200
                       hover:bg-red-50 text-gray-400 hover:text-red-500
                       md:opacity-0 opacity-100"
              title="Delist Product"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="p-2 sm:p-3 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
              {productInfo?.name}
            </h3>
            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
              {productInfo?.description}
            </p>
            <span className="text-sm font-semibold text-primary-600">
              ${productInfo?.price}
            </span>
          </div>
          {!isManagement && !isReview && (
            <button
              onClick={handleBuy}
              className="mt-2 w-full bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>

      {showDetail && (
        <ProductDetail
          product={product}
          productInfo={productInfo}
          onClose={() => setShowDetail(false)}
          isManagement={isManagement}
          onDelist={onDelist}
          isReview={isReview}
          onReview={onReview}
        />
      )}

      {/* QuantityDialog */}
      {showQuantity &&
        (
          <QuantityDialog price={product.price} maxValue={product.stockCount} onConfirm={onQuantityConfirm} onClose={onQuantityClose} />
        )
      }

      {/* AddressDialog */}
      {showAddress && (
        <AddressDialog quantity={quantity} onConfirm={onConfirm} onClose={onAddressClose} />
      )}
    </>
  );
};
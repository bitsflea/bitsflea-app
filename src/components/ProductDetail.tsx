import React, { useState } from 'react';
import { X, ShoppingBag, Star, Truck, Shield, ArrowRight, MessageCircle, XCircle, ClipboardCheck, Heart, UserPlus } from 'lucide-react';
import { Product, ProductInfo, ProductStatus } from '../types';
import { ImageCarousel } from './ImageCarousel';
import { Chat } from './Chat';
import { ReviewForm } from './ReviewForm';
import { getCategoryByValue } from '../data/categories';

interface ProductDetailProps {
  product: Product;
  productInfo: ProductInfo;
  onClose: () => void;
  isManagement?: boolean;
  isReview?: boolean;
  onDelist?: (productId: string) => void;
  onReview?: (productId: string | undefined, approved: boolean, reason: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  productInfo,
  onClose,
  isManagement = false,
  isReview = false,
  onDelist,
  onReview
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const features = [
    { icon: Star, text: "Verified Seller" },
    { icon: Truck, text: "Secure Delivery" },
    { icon: Shield, text: "Buyer Protection" }
  ];

  const handleBuy = async () => {
    try {
      // TODO: Implement NaBox wallet integration
      console.log('Buying product:', product);
      alert('NaBox wallet integration coming soon!');
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };

  const handleDelist = () => {
    if (onDelist) {
      onDelist(product.pid);
      onClose();
    }
  };

  const handleReview = (productId: string | undefined, approved: boolean, reason: string) => {
    if (onReview) {
      onReview(productId, approved, reason);
      onClose();
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality
  };

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFollowing(!isFollowing);
    // TODO: Implement follow functionality
  };

  // 模拟卖家信息
  const seller = {
    id: 2,
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Left Column - Image */}
              <div>
                <ImageCarousel images={productInfo.images} height="h-[400px]" />
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryByValue(product.category)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full transition-colors ${isFavorite
                          ? 'bg-red-50 text-red-500'
                          : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                          }`}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleToggleFollow}
                        className={`p-2 rounded-full transition-colors ${isFollowing
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-gray-100 text-gray-400 hover:text-primary-600'
                          }`}
                        title={isFollowing ? 'Unfollow seller' : 'Follow seller'}
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{productInfo.name}</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-600">${productInfo.price}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{productInfo.description}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  {features.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
                      <Icon className="h-6 w-6 text-primary-600 mb-2" />
                      <span className="text-sm text-gray-600">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {isReview ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-100"
                  >
                    <ClipboardCheck className="h-5 w-5" />
                    Review Product
                  </button>
                ) : !isManagement ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <button
                        onClick={handleBuy}
                        className="flex-1 bg-primary-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-100"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Buy Now
                      </button>
                      <button
                        onClick={() => setShowChat(true)}
                        className="bg-white border-2 border-primary-600 text-primary-600 px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-all duration-300"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="hidden sm:inline">Contact Seller</span>
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full border-2 border-gray-200 text-gray-600 px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300"
                    >
                      Continue Browsing
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  product.status === ProductStatus.NORMAL && (
                    <button
                      onClick={handleDelist}
                      className="w-full border-2 border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all duration-300"
                    >
                      <XCircle className="h-5 w-5" />
                      Delist Product
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Condition</h4>
                    <ul className="space-y-2 text-gray-600">
                      {productInfo.condition.map((item) => (<li>{item}</li>))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                    <ul className="space-y-2 text-gray-600">
                      {productInfo.shipping.map((item) => (<li>{item}</li>))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center">
          <Chat
            onClose={() => setShowChat(false)}
            seller={seller}
            product={productInfo}
          />
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          product={productInfo}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReview}
        />
      )}
    </>
  );
};
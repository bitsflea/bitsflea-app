import React, { useState } from 'react';
import { Search, AlertCircle, Shield } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductDetail } from './ProductDetail';
import { Product } from '../types';

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Camera",
    price: 299.99,
    description: "Classic film camera in excellent condition",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: 'draft'
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 159.99,
    description: "Cherry MX switches, RGB backlight, like new",
    images: [
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: 'draft'
  },
  {
    id: 3,
    name: "Leather Messenger Bag",
    price: 89.99,
    description: "Genuine leather, minimal wear, perfect for laptops",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Fashion",
    status: 'draft'
  },
  {
    id: 4,
    name: "Retro Record Player",
    price: 199.99,
    description: "Fully functional turntable with built-in speakers",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1542729779-11d8fe8e25f6?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: 'draft'
  },
  {
    id: 5,
    name: "Vintage Watch Collection",
    price: 499.99,
    description: "Set of 3 classic timepieces, all working perfectly",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Fashion",
    status: 'draft'
  },
  {
    id: 6,
    name: "Antique Desk Lamp",
    price: 129.99,
    description: "Art deco style, brass finish, rewired for safety",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Home",
    status: 'draft'
  },
  {
    id: 7,
    name: "Vintage Polaroid Camera",
    price: 149.99,
    description: "Fully tested and working, includes original case",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: 'draft'
  },
  {
    id: 8,
    name: "Classic Guitar",
    price: 399.99,
    description: "Acoustic guitar with beautiful tone, minor wear",
    images: [
      "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Music",
    status: 'draft'
  }
];

export const ProductReview: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReview = (productId: number, approved: boolean, reason: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProduct(null);
    console.log('Review submitted:', { productId, approved, reason });
  };

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
        <div className="mb-6">
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
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isReview={true}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products to review</p>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            isReview={true}
            onReview={handleReview}
          />
        )}
      </div>
    </div>
  );
};
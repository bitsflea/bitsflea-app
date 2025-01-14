import { Product, ProductStatus } from '../types';

export const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    description: "High-quality wireless headphones with noise cancellation",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: ProductStatus.PUBLISH
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    description: "Latest generation smartwatch with health tracking",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Electronics",
    status: ProductStatus.NORMAL
  },
  {
    id: 3,
    name: "Designer Backpack",
    price: 79.99,
    description: "Stylish and functional backpack for everyday use",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Fashion",
    status: ProductStatus.DELISTED
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 129.99,
    description: "Comfortable running shoes with advanced cushioning",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Sports",
    status: ProductStatus.DELISTED
  },
  {
    id: 5,
    name: "Gaming Console",
    price: 499.99,
    description: "Next-gen gaming console for immersive gaming experience",
    images: [
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Toys",
    status: ProductStatus.LOCKED
  }
];
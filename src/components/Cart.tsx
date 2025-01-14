import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const Cart = () => {
  const { state, dispatch } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary-50 p-4 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Start adding some items to your cart!</p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-100">
            Continue Shopping
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Cart Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-primary-600" />
          Shopping Cart
        </h2>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto">
        {state.items.map(item => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <span className="text-sm text-gray-500">${item.price}</span>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, quantity: Math.max(0, item.quantity - 1) }
                        })
                      }
                      className="p-1 rounded-md hover:bg-white text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, quantity: item.quantity + 1 }
                        })
                      }
                      className="p-1 rounded-md hover:bg-white text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-medium text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
            <span>Total:</span>
            <span className="text-primary-600">${state.total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <button className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-100">
            Proceed to Checkout
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
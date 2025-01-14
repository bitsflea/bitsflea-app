import React from 'react';
import { CreditCard, Package2, Truck, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Scale, Clock } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatDate } from '../utils/date';

interface OrderItemProps {
  order: Order;
  onClick: () => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingPayment:
        return {
          icon: CreditCard,
          text: 'Payment',
          className: 'bg-orange-100 text-orange-800'
        };
      case OrderStatus.PendingConfirmation:
        return {
          icon: Clock,
          text: 'Confirmation',
          className: 'bg-blue-100 text-blue-800'
        };
      case OrderStatus.Cancelled:
        return {
          icon: XCircle,
          text: 'Cancelled',
          className: 'bg-gray-100 text-gray-800'
        };
      case OrderStatus.PendingShipment:
        return {
          icon: Package2,
          text: 'Shipping',
          className: 'bg-purple-100 text-purple-800'
        };
      case OrderStatus.PendingReceipt:
        return {
          icon: Truck,
          text: 'Receipt',
          className: 'bg-indigo-100 text-indigo-800'
        };
      case OrderStatus.PendingSettlement:
        return {
          icon: Scale,
          text: 'Settlement',
          className: 'bg-cyan-100 text-cyan-800'
        };
      case OrderStatus.Completed:
        return {
          icon: CheckCircle2,
          text: 'Completed',
          className: 'bg-green-100 text-green-800'
        };
      case OrderStatus.InArbitration:
        return {
          icon: AlertTriangle,
          text: 'Arbitration',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case OrderStatus.Returning:
        return {
          icon: RotateCcw,
          text: 'Returning',
          className: 'bg-rose-100 text-rose-800'
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

export const OrderItem: React.FC<OrderItemProps> = ({ order, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-4">
        {/* Order Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Order ID: {order.oid}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Product Info */}
        <div className="flex gap-4">
          <img
            src={order.product.images[0]}
            alt={order.product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
              {order.product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-primary-600">
                ${order.amount}
              </span>
              {Number(order.postage) > 0 && (
                <span className="text-sm text-gray-500">
                  + ${order.postage} shipping
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Footer */}
        <div className="mt-4 text-sm text-gray-500">
          Created at: {formatDate(order.createTime)}
        </div>
      </div>
    </div>
  );
};
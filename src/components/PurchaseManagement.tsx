import React, { useState } from 'react';
import { Filter, ChevronDown, CreditCard, Package2, Truck, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OrderItem } from './OrderItem';
import { OrderDetail } from './OrderDetail';

interface PurchaseManagementProps {
  orders: Order[];
}

const statusFilters: { value: OrderStatus | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All Orders', icon: Filter },
  { value: OrderStatus.PendingPayment, label: 'Pending Payment', icon: CreditCard },
  { value: OrderStatus.PendingShipment, label: 'Pending Shipment', icon: Package2 },
  { value: OrderStatus.PendingReceipt, label: 'Pending Receipt', icon: Truck },
  { value: OrderStatus.Completed, label: 'Completed', icon: CheckCircle2 },
  { value: OrderStatus.Returning, label: 'Returning', icon: RotateCcw },
  { value: OrderStatus.Cancelled, label: 'Cancelled', icon: XCircle },
];

export const PurchaseManagement: React.FC<PurchaseManagementProps> = ({ orders }) => {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  const activeFilterLabel = statusFilters.find(f => f.value === activeFilter)?.label;
  const ActiveFilterIcon = statusFilters.find(f => f.value === activeFilter)?.icon || Filter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Mobile Filter Dropdown */}
          <div className="relative flex-1 sm:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <ActiveFilterIcon className="h-5 w-5 text-primary-600" />
                <span className="text-gray-700">{activeFilterLabel}</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                {statusFilters.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveFilter(value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 transition-colors ${
                      activeFilter === value
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Filter Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            {statusFilters.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${activeFilter === value
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <OrderItem 
              key={order.oid} 
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
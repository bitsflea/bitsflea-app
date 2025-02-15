import React, { useEffect, useState } from 'react';
import { MapPin, Clock3 } from 'lucide-react';
import { formatDate } from '../utils/date';
import { Order, OrderStatus, ProductReturn } from '../types';
import { useHelia } from '../context/HeliaContext';

// Mock shipping details for PendingReceipt status
const mockShippingDetails = [
  {
    time: Date.now() - 172800000, // 48 hours ago
    location: "Shipping Center, Los Angeles",
    status: "Package received at shipping center"
  },
  {
    time: Date.now() - 144000000, // 40 hours ago
    location: "Transit Hub, Chicago",
    status: "Package in transit"
  },
  {
    time: Date.now() - 86400000, // 24 hours ago
    location: "Local Delivery Center, New York",
    status: "Out for delivery"
  }
];

interface TimelineEvent {
  time: number;
  location: string;
  status: string;
}

interface OrderTimelineProps {
  order: Order;
  status: OrderStatus;
  createTime: number;
  payTime: number | null;
  shipTime: number | null;
  receiptTime: number | null;
  endTime: number | null;
  isPendingReceipt?: boolean;
  returnInfo?: ProductReturn | null;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  order,
  status,
  createTime,
  payTime,
  shipTime,
  receiptTime,
  endTime,
  isPendingReceipt,
  returnInfo
}) => {
  const [shippingDetails, setShippingDetails] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const loadShipping = async () => {
      //TODO:调用api实现

      // test code
      setShippingDetails(mockShippingDetails)
    }
    loadShipping()
  }, [order.shipmentNumber])

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Order Created</div>
            <div className="text-sm text-gray-500">{formatDate(createTime)}</div>
          </div>
        </div>

        {payTime && (
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Payment Completed</div>
              <div className="text-sm text-gray-500">{formatDate(payTime)}</div>
            </div>
          </div>
        )}

        {shipTime && (
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Order Shipped</div>
              <div className="text-sm text-gray-500">{formatDate(shipTime)}</div>
            </div>
          </div>
        )}

        {isPendingReceipt && shippingDetails && (
          <div className="ml-9 mt-2 space-y-4">
            {shippingDetails.map((detail, index) => (
              <div key={index} className="relative pl-6 pb-4 border-l-2 border-primary-100 last:border-l-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-primary-600" />
                </div>
                <div className="font-medium text-gray-900">{detail.status}</div>
                <div className="text-sm text-gray-500">{detail.location}</div>
                <div className="text-sm text-gray-400">{formatDate(detail.time)}</div>
              </div>
            ))}
          </div>
        )}

        {returnInfo && (
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Order Return</div>
              <div className="text-sm text-gray-500">Reasons: {returnInfo.reasons}</div>
              <div className="text-sm text-gray-500">{formatDate(returnInfo.createTime)}</div>
            </div>
          </div>
        )}

        {returnInfo && returnInfo.shipTime && (
          <div className="ml-9 mt-2 space-y-4">
            <div className="relative pl-6 border-l-2 border-primary-100 last:border-l-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center">
                <Clock3 className="h-3 w-3 text-primary-600" />
              </div>
              <div className="font-medium text-gray-900">Return Shipped</div>
              <div className="text-sm text-gray-500">Tracking Number: {returnInfo.shipmentsNumber}</div>
              <div className="text-sm text-gray-400">{formatDate(returnInfo.shipTime)}</div>
            </div>
          </div>
        )}

        {returnInfo && returnInfo.receiptTime && (
          <div className="ml-9 mt-2 space-y-4">
            <div className="relative pl-6 border-l-2 border-primary-100 last:border-l-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center">
                <Clock3 className="h-3 w-3 text-primary-600" />
              </div>
              <div className="font-medium text-gray-900">Return Received</div>
              <div className="text-sm text-gray-400">{formatDate(returnInfo.receiptTime)}</div>
            </div>
          </div>
        )}


        {receiptTime && (
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Order Received</div>
              <div className="text-sm text-gray-500">{formatDate(receiptTime)}</div>
            </div>
          </div>
        )}

        {endTime && (
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{status === OrderStatus.Completed ? "Order Completed" : "Order Cancelled"}</div>
              <div className="text-sm text-gray-500">{formatDate(endTime)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
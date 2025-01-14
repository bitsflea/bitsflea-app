import React from 'react';
import { MapPin } from 'lucide-react';
import { formatDate } from '../utils/date';

interface TimelineEvent {
  time: number;
  location: string;
  status: string;
}

interface OrderTimelineProps {
  createTime: number;
  payTime: number | null;
  shipTime: number | null;
  receiptTime: number | null;
  endTime: number | null;
  isPendingReceipt?: boolean;
  shippingDetails?: TimelineEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  createTime,
  payTime,
  shipTime,
  receiptTime,
  endTime,
  isPendingReceipt,
  shippingDetails
}) => {
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
              <div className="font-medium text-gray-900">Order Completed</div>
              <div className="text-sm text-gray-500">{formatDate(endTime)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
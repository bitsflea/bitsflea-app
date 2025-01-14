import React, { useState } from 'react';
import { X, CreditCard, Package2, Truck, RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle, Scale, Wallet } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OrderProductInfo } from './OrderProductInfo';
import { OrderAdditionalInfo } from './OrderAdditionalInfo';
import { OrderTimeline } from './OrderTimeline';
import { formatDate } from '../utils/date';
import { ReturnForm } from './ReturnForm';
import {ShipmentForm} from './ShipmentForm';

interface OrderDetailProps {
    order: Order;
    onClose: () => void;
}

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

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [showShipmentForm,setShowShipmentForm]=useState(false);

    const handlePayment = async () => {
        try {
            // TODO: Implement NaBox wallet integration
            console.log('Processing payment for order:', order.oid);
            alert('NaBox wallet integration coming soon!');
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const handleConfirmReceipt = async () => {
        try {
            console.log('Confirming receipt for order:', order.oid);
            alert('Receipt confirmation will be implemented soon!');
        } catch (error) {
            console.error('Error confirming receipt:', error);
        }
    };

  const handleShipReturn = async () => {
        setShowShipmentForm(true);
    };

    const handleReturn = async () => {
        setShowReturnForm(true);
    };

    const handleReturnSubmit = (data: { images: string[]; reason: string }) => {
        console.log('Return request submitted:', { orderId: order.oid, ...data });
        setShowReturnForm(false);
        // TODO: Implement return request submission
        alert('Return request submitted successfully!');
    };

    const handleShipmentSubmit=(data:{shipmentNumber:string})=>{
      console.log('Shipment submitted:', { orderId: order.oid, ...data });
      setShowShipmentForm(false);
      alert('Shipment request submitted successfully!');
    }

    const getStatusInfo = () => {
        switch (order.status) {
            case OrderStatus.PendingPayment:
                return {
                    icon: CreditCard,
                    title: 'Pending Payment',
                    description: 'Please complete the payment',
                    timeoutDate: order.payTimeOut
                };
            case OrderStatus.PendingConfirmation:
                return {
                    icon: Clock,
                    title: 'Pending Confirmation',
                    description: 'Waiting for seller confirmation',
                    timeoutDate: null
                };
            case OrderStatus.Cancelled:
                return {
                    icon: XCircle,
                    title: 'Cancelled',
                    description: 'Order has been cancelled',
                    timeoutDate: null
                };
            case OrderStatus.PendingShipment:
                return {
                    icon: Package2,
                    title: 'Pending Shipment',
                    description: 'Seller is preparing your order',
                    timeoutDate: order.shipTimeOut
                };
            case OrderStatus.PendingReceipt:
                return {
                    icon: Truck,
                    title: 'Pending Receipt',
                    description: 'Your order is on the way',
                    timeoutDate: order.receiptTimeOut
                };
            case OrderStatus.PendingSettlement:
                return {
                    icon: Scale,
                    title: 'Pending Settlement',
                    description: 'Processing payment settlement',
                    timeoutDate: null
                };
            case OrderStatus.Completed:
                return {
                    icon: CheckCircle2,
                    title: 'Completed',
                    description: 'Order completed successfully',
                    timeoutDate: null
                };
            case OrderStatus.InArbitration:
                return {
                    icon: AlertTriangle,
                    title: 'In Arbitration',
                    description: 'Order is under arbitration',
                    timeoutDate: null
                };
            case OrderStatus.Returning:
                return {
                    icon: RotateCcw,
                    title: 'Returning',
                    description: 'Processing return request',
                    timeoutDate: null
                };
        }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    const getStatusColor = () => {
        switch (order.status) {
            case OrderStatus.Completed:
                return 'bg-green-100 text-green-600';
            case OrderStatus.Cancelled:
                return 'bg-gray-100 text-gray-600';
            case OrderStatus.InArbitration:
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-primary-100 text-primary-600';
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        {/* Status Section */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${getStatusColor()}`}>
                                    <StatusIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {statusInfo.title}
                                    </h3>
                                    <p className="text-gray-600">{statusInfo.description}</p>
                                    {statusInfo.timeoutDate && (
                                        <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Expires at: {formatDate(statusInfo.timeoutDate)}</span>
                                        </div>
                                    )}
                                </div>
                                {order.status === OrderStatus.PendingPayment && (
                                    <button
                                        onClick={handlePayment}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <Wallet className="h-5 w-5" />
                                        <span>Pay Now</span>
                                    </button>
                                )}
                                {order.status === OrderStatus.Returning && (
                                  <button
                                    onClick={handleShipReturn}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                  >
                                    <Truck className="h-5 w-5" />
                                    <span>Ship Return</span>
                                  </button>
                                )}
                            </div>
                            {order.status === OrderStatus.PendingReceipt && (
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleReturn}
                                        className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                    >
                                        <RotateCcw className="h-5 w-5" />
                                        <span>Return</span>
                                    </button>
                                    <button
                                        onClick={handleConfirmReceipt}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Confirm</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <OrderProductInfo
                            product={order.product}
                            amount={order.amount}
                            postage={order.postage}
                        />

                        {/* Additional Info */}
                        <OrderAdditionalInfo
                            orderId={order.oid}
                            seller={order.seller}
                            shipmentNumber={order.shipmentNumber}
                            delayedCount={order.delayedCount}
                        />

                        {/* Order Timeline */}
                        <OrderTimeline
                            createTime={order.createTime}
                            payTime={order.payTime}
                            shipTime={order.shipTime}
                            receiptTime={order.receiptTime}
                            endTime={order.endTime}
                            isPendingReceipt={order.status === OrderStatus.PendingReceipt}
                            shippingDetails={order.status === OrderStatus.PendingReceipt ? mockShippingDetails : undefined}
                        />
                    </div>
                </div>
            </div>
            {/* Return Form Modal */}
            {showReturnForm && (
                <ReturnForm
                    orderId={order.oid}
                    onClose={() => setShowReturnForm(false)}
                    onSubmit={handleReturnSubmit}
                />
            )}

          {showShipmentForm && (
            <ShipmentForm orderId={order.oid} onClose={()=>setShowShipmentForm(false)}
              onSubmit={handleShipmentSubmit}
              />
          )
            
          }
        </>
    );
};
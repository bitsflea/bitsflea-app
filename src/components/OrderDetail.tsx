import React, { useEffect, useState } from 'react';
import { X, CreditCard, Package2, Truck, RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle, Scale, Wallet } from 'lucide-react';
import { Order, OrderStatus, ProductReturn, ReturnReason } from '../types';
import { OrderProductInfo } from './OrderProductInfo';
import { OrderAdditionalInfo } from './OrderAdditionalInfo';
import { OrderTimeline } from './OrderTimeline';
import { formatDate } from '../utils/date';
import { ReturnForm } from './ReturnForm';
import { ShipmentForm } from './ShipmentForm';
import { getPrice } from '../utils/nuls';
import { useAuth } from '../context/AuthContext';
import config from '../data/config';
import { useHelia } from '../context/HeliaContext';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import { parseNULS } from 'nuls-api-v2';
import { addJson, getJson } from '../utils/ipfs';
import { safeExecuteAsync } from '../data/error';

interface OrderDetailProps {
    order: Order;
    onClose: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [showShipmentForm, setShowShipmentForm] = useState(false);
    const { user } = useAuth();
    const { nuls, bitsflea } = useHelia();
    const { showToast } = useToast();
    const { showLoading, hideLoading } = useLoading();
    const [returnInfo, setReturnInfo] = useState<ProductReturn | undefined | null>()
    const ctx = useHelia();

    useEffect(() => {
        const loadReturn = async () => {
            await safeExecuteAsync(async () => {
                const info = await bitsflea!.getProductReturn(order.oid)
                console.debug("return info:", info)
                if (info) {
                    if (info.reasons != null && info.reasons != "" && info.reasons.startsWith("{") === false) {
                        const reason = await getJson(ctx, info.reasons)
                        info.reasons = JSON.stringify(reason)
                    }
                }
                setReturnInfo(info)
            })
        }
        if (bitsflea) {
            loadReturn()
        }
    }, [order.oid])

    const handlePayment = async () => {
        showLoading();
        await safeExecuteAsync(async () => {
            console.debug('Processing payment for order:', order);
            const amount = getPrice(order.amount);
            const postage = getPrice(order.postage);
            amount.value += postage.value;
            console.debug("amount:", amount.value)
            const callData = {
                from: user!.uid,
                value: 0,
                contractAddress: config.contracts.Bitsflea,
                methodName: "payOrder",
                methodDesc: "",
                args: [order.oid],
                multyAssetValues: []
            }
            if (amount.assetId === "2,1") {
                callData.value = amount.value;
            } else if (amount.assetId === "0,0") {
                callData.contractAddress = config.contracts.Point;
                callData.methodName = "transferAndCall";
                callData.args = [config.contracts.Bitsflea, parseNULS(amount.value, amount.decimals).toString(10), order.oid];
            } else {
                const asset = amount.assetId.split(",")
                // @ts-ignore
                callData.multyAssetValues = [[parseNULS(amount.value, amount.decimals).toString(10), asset[0], asset[1]]]
            }
            console.debug("callData:", callData);
            const txHash = await window.nabox!.contractCall(callData);
            await nuls?.waitingResult(txHash);
            onClose();
        }, "payment error:", () => {
            hideLoading();
        })
    };

    const handleConfirmReceipt = async () => {
        showLoading()
        await safeExecuteAsync(async () => {
            console.debug('Confirming receipt for order:', order.oid);
            const callData = {
                from: user!.uid,
                value: 0,
                contractAddress: config.contracts.Bitsflea,
                methodName: "confirmReceipt",
                methodDesc: "",
                args: [order.oid],
                multyAssetValues: []
            }
            const txHash = await window.nabox!.contractCall(callData);
            await nuls?.waitingResult(txHash);
            onClose();
        }, "Error confirming receipt:", () => {
            hideLoading()
        })
    };

    const handleReConfirmReceipt = async () => {
        showLoading()
        await safeExecuteAsync(async () => {
            console.debug('Confirming receipt for order:', order.oid);
            const callData = {
                from: user!.uid,
                value: 0,
                contractAddress: config.contracts.Bitsflea,
                methodName: "reConfirmReceipt",
                methodDesc: "",
                args: [order.oid],
                multyAssetValues: []
            }
            const txHash = await window.nabox!.contractCall(callData);
            await nuls?.waitingResult(txHash);
            onClose();
        }, "Error confirming receipt:", () => {
            hideLoading()
        })
    };

    const handleShipping = async () => {
        setShowShipmentForm(true);
    }

    const handleShipReturn = async () => {
        setShowShipmentForm(true);
    };

    const handleReturn = async () => {
        setShowReturnForm(true);
    };

    const handleReturnSubmit = async (data: ReturnReason) => {
        showLoading()
        console.debug('Return request submitted:', { orderId: order.oid, ...data });
        setShowReturnForm(false);

        const cid = await addJson(ctx, data)
        console.debug('IPFS CID:', cid);

        if (!cid) {
            showToast("error", "Image upload failed.");
            hideLoading();
            return;
        }

        await safeExecuteAsync(async () => {
            const callData = {
                from: user!.uid,
                value: 0,
                contractAddress: config.contracts.Bitsflea,
                methodName: "returns",
                methodDesc: "",
                args: [order.oid, cid],
                multyAssetValues: []
            }
            console.debug("callData:", callData);
            const txHash = await window.nabox!.contractCall(callData);
            await ctx?.nuls?.waitingResult(txHash);
        }, undefined, () => {
            hideLoading()
        })
    };

    const handleShipmentSubmit = async (data: { shipmentNumber: string }) => {
        console.debug('Shipment submitted:', { orderId: order.oid, ...data });
        setShowShipmentForm(false);
        showLoading()

        await safeExecuteAsync(async () => {
            if (order.status === OrderStatus.PendingShipment && user?.uid === order.seller) {//发货
                const callData = {
                    from: user!.uid,
                    value: 0,
                    contractAddress: config.contracts.Bitsflea,
                    methodName: "shipments",
                    methodDesc: "",
                    args: [order.oid, data.shipmentNumber],
                    multyAssetValues: []
                }
                const txHash = await window.nabox!.contractCall(callData);
                await nuls?.waitingResult(txHash);
                onClose();
            } else if (order.status === OrderStatus.Returning && user?.uid === order.buyer) { //退货发货
                const callData = {
                    from: user!.uid,
                    value: 0,
                    contractAddress: config.contracts.Bitsflea,
                    methodName: "reShipments",
                    methodDesc: "",
                    args: [order.oid, data.shipmentNumber],
                    multyAssetValues: []
                }
                const txHash = await window.nabox!.contractCall(callData);
                await nuls?.waitingResult(txHash);
                onClose();
            }
        }, undefined, () => {
            hideLoading()
        })
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
                if (user?.uid == order.seller) {
                    return {
                        icon: Package2,
                        title: 'Pending Shipment',
                        description: 'Please ship as soon as possible',
                        timeoutDate: order.shipTimeOut
                    };
                } else {
                    return {
                        icon: Package2,
                        title: 'Pending Shipment',
                        description: 'Seller is preparing your order',
                        timeoutDate: order.shipTimeOut
                    };
                }

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
                                {order.status === OrderStatus.PendingPayment && user?.uid == order.buyer && (
                                    <button
                                        onClick={handlePayment}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <Wallet className="h-5 w-5" />
                                        <span>Pay Now</span>
                                    </button>
                                )}

                                {order.status === OrderStatus.PendingShipment && user?.uid === order.seller && (
                                    <button
                                        onClick={handleShipping}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Shipping</span>
                                    </button>
                                )}

                                {order.status === OrderStatus.Returning && (returnInfo && returnInfo.status === 0) && user?.uid === order.buyer && (
                                    <button
                                        onClick={handleShipReturn}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Ship Return</span>
                                    </button>
                                )}

                                {order.status === OrderStatus.Returning && (returnInfo && returnInfo.status === 100) && user?.uid === order.seller && (
                                    <button
                                        onClick={handleReConfirmReceipt}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Confirm</span>
                                    </button>
                                )}

                            </div>
                            {order.status === OrderStatus.PendingReceipt && user?.uid === order.buyer && (
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
                            buyer={order.buyer}
                            shipmentNumber={order.shipmentNumber}
                            delayedCount={order.delayedCount}
                            deliveryInfo={order.receiptInfo}
                        />

                        {/* Order Timeline */}
                        <OrderTimeline
                            order={order}
                            returnInfo={returnInfo}
                            status={order.status}
                            createTime={order.createTime}
                            payTime={order.payTime}
                            shipTime={order.shipTime}
                            receiptTime={order.receiptTime}
                            endTime={order.endTime}
                            isPendingReceipt={order.status === OrderStatus.PendingReceipt}
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
                <ShipmentForm orderId={order.oid} onClose={() => setShowShipmentForm(false)}
                    onSubmit={handleShipmentSubmit}
                />
            )

            }
        </>
    );
};
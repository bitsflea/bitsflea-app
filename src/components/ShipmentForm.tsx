import React, { useState } from 'react';
import { X, Package2, Truck } from 'lucide-react';

interface ShipmentFormProps {
    orderId: string;
    onClose: () => void;
    onSubmit: (data: { shipmentNumber: string }) => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
    orderId,
    onClose,
    onSubmit
}) => {
    const [shipmentNumber, setShipmentNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ shipmentNumber });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Ship Return</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Order ID */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Order ID</span>
                            <span className="text-sm font-medium text-gray-900">{orderId}</span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package2 className="h-5 w-5" />
                            <span>Please enter the return shipment tracking number</span>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="shipmentNumber" className="block text-sm font-medium text-gray-700">
                                Tracking Number
                            </label>
                            <input
                                type="text"
                                id="shipmentNumber"
                                value={shipmentNumber}
                                onChange={(e) => setShipmentNumber(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter tracking number"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100 flex items-center justify-center gap-2"
                        >
                            <Truck className="h-5 w-5" />
                            <span>Submit</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
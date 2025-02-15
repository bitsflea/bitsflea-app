import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { getPrice } from '../utils/nuls';

interface QuantityDialogProps {
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    price: string;
    maxValue: number;
}

export const QuantityDialog: React.FC<QuantityDialogProps> = ({
    onClose,
    onConfirm,
    price,
    maxValue
}) => {
    const [quantity, setQuantity] = useState(1);

    const priceInfo = getPrice(price);

    const handleQuantityChange = (value: number) => {
        setQuantity(Math.max(1, Math.min(value, maxValue)));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Select Quantity</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                            <Minus className="h-6 w-6" />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="w-20 text-center text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                        />
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                            <Plus className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Total Price</div>
                        <div className="text-2xl font-bold text-primary-600">
                            ${(priceInfo.value * quantity).toFixed(2)} {priceInfo.symbol}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => onConfirm(quantity)}
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
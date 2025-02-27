import { MapPin, Settings, Star, Trash2, CheckCircle } from "lucide-react";
import { Address } from "../types";
import React from 'react';

interface AddressCardProps {
    address: Address
    onSetDefault?: (id: number) => void
    handleEdit?: (address: Address) => void
    onDeleteAddress?: (id: number) => void
    selectId?: number
    onSelect?: (address: Address) => void
}

export const AddressCard: React.FC<AddressCardProps> = ({
    address,
    onSetDefault,
    handleEdit,
    onDeleteAddress,
    selectId,
    onSelect
}) => {

    const handleSelect = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onSelect) {
            onSelect(address)
        }
    }

    return (
        <div className={`bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative ${!!onSelect ? 'cursor-pointer' : ''}`} onClick={handleSelect}>
            <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2 sm:gap-3">
                    <div className="mt-1">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">{address.name}</h3>
                            <span className="text-xs sm:text-sm text-gray-500">{address.phone}</span>
                            {address.isDefault && (
                                <span className="bg-primary-50 text-primary-600 text-xs px-2 py-0.5 rounded-full">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-0.5">
                            {address.location.country} {address.location.region} {address.location.district}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">{address.address}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {!!selectId && selectId === address.id && (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                    )}

                    {!address.isDefault && !!onSetDefault && (
                        <button
                            onClick={() => onSetDefault(address.id)}
                            className="text-gray-400 hover:text-yellow-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                            title="Set as Default"
                        >
                            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    )}

                    {!!handleEdit && (
                        <button
                            onClick={() => handleEdit(address)}
                            className="text-gray-400 hover:text-primary-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                        >
                            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    )}

                    {!!onDeleteAddress && (
                        <button
                            onClick={() => onDeleteAddress(address.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                        >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
import React, { useEffect, useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { Address } from '../types';
import { useAuth } from '../context/AuthContext';
import { useHelia } from '../context/HeliaContext';
import { safeExecuteAsync } from '../data/error';
import { getAddresses, setAddresses } from '../utils/db';
import { AddressCard } from './AddressCard';
import { AddressEditor } from './AddressEditor';

interface AddressDialogProps {
    onClose: () => void;
    onConfirm: (quantity: number, address?: Address) => void;
    quantity: number;
}

export const AddressDialog: React.FC<AddressDialogProps> = ({
    onClose,
    onConfirm,
    quantity
}) => {
    const { user } = useAuth()
    const { userDB } = useHelia()
    const [addresses, setAddress] = useState<Address[]>([])
    const [selectAddr, setSelectAddr] = useState<Address | undefined>()
    const [showAdd, setShowAdd] = useState(false)

    useEffect(() => {
        const loadAddress = async () => {
            await safeExecuteAsync(async () => {
                let data = await getAddresses(userDB, user!.uid)
                console.debug("data:", data)
                if (data) {
                    setAddress(data)
                    const defaultAddr = data.find((v) => v.isDefault)
                    if (defaultAddr) {
                        setSelectAddr(defaultAddr)
                    }
                }
            }, "loadAddress:")
        }
        loadAddress()
    }, [showAdd])

    const onSelect = (address: Address) => {
        setSelectAddr(address)
    }

    const handleAddressClick = () => {
        onConfirm(quantity, selectAddr)
    };

    const handleSaveAddress = async (address: Address) => {
        console.debug("address:", address)
        if (address) {
            address.isDefault = true
            await setAddresses(userDB, user!.uid, [address])
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Select Address</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        <div className="grid gap-3 sm:gap-4 max-h-96 overflow-y-auto">
                            {addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <AddressCard key={address.id} address={address} selectId={!!selectAddr ? selectAddr.id : undefined} onSelect={onSelect} />
                                ))
                            ) : (
                                (
                                    <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No addresses yet</p>
                                        <div className='flex justify-center'>
                                            <button onClick={() => setShowAdd(true)}
                                                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                                <Plus className="h-4 w-4" />
                                                <span>Add Address</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddressClick}
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
            {showAdd && (
                <AddressEditor
                    onClose={() => {
                        setShowAdd(false)
                    }}
                    onSave={handleSaveAddress}
                />
            )}
        </>

    );
};
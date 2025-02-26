import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Settings, Star, Trash2 } from 'lucide-react';
import { Address } from '../types';
import { AddressEditor } from './AddressEditor';
import { useHelia } from '../context/HeliaContext';
import { getAddresses, setAddresses } from '../utils/db';
import { useAuth } from '../context/AuthContext';
import { safeExecuteAsync } from '../data/error';

interface AddressManagementProps {
  onAddAddress: (address: Address) => void;
  onEditAddress: (address: Address) => void;
}

export const AddressManagement: React.FC<AddressManagementProps> = ({
  onAddAddress,
  onEditAddress,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [addresses, setAddress] = useState<Address[]>([])
  const { user } = useAuth()
  const { userDB } = useHelia()

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowEditor(true);
  };

  useEffect(() => {
    const loadAddress = async () => {
      await safeExecuteAsync(async () => {
        let data = await getAddresses(userDB, user!.uid)
        // console.log("data:", data)
        if (data) {
          setAddress(data)
        }
      }, "loadAddress:")
    }
    loadAddress()
  }, [])

  const handleSave = async (address: Address) => {
    if (editingAddress) {
      onEditAddress(address);
      let index = addresses.findIndex((v) => v.id === address.id)
      addresses[index] = address
      await setAddresses(userDB, user!.uid, addresses)
      setAddress([...addresses])
    } else {
      onAddAddress(address);
      let data = [...addresses, address]
      await setAddresses(userDB, user!.uid, data)
      setAddress(data)
    }
    setShowEditor(false);
    setEditingAddress(undefined);
  };

  const onDeleteAddress = async (id: number) => {
    let index = addresses.findIndex((v) => v.id === id)
    addresses.splice(index, 1)
    await setAddresses(userDB, user!.uid, addresses)
    setAddress([...addresses])
  }

  const onSetDefault = async (id: number) => {
    addresses.forEach((v) => {
      if (v.id === id) {
        v.isDefault = true
      } else {
        v.isDefault = false
      }
    })
    await setAddresses(userDB, user!.uid, addresses)
    setAddress([...addresses])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(undefined);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative"
            >
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
                  {!address.isDefault && (
                    <button
                      onClick={() => onSetDefault(address.id)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                      title="Set as Default"
                    >
                      <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-gray-400 hover:text-primary-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => onDeleteAddress(address.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No addresses yet</p>
          </div>
        )}
      </div>

      {showEditor && (
        <AddressEditor
          onClose={() => {
            setShowEditor(false);
            setEditingAddress(undefined);
          }}
          onSave={handleSave}
          initialData={editingAddress}
        />
      )}
    </div>
  );
};
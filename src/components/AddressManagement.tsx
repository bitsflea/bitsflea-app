import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Settings, Star, Trash2 } from 'lucide-react';
import { Address } from '../types';
import { AddressEditor } from './AddressEditor';
import { useHelia } from '../context/HeliaContext';
import { getAddresses, setAddresses } from '../utils/db';
import { useAuth } from '../context/AuthContext';
import { safeExecuteAsync } from '../data/error';
import { AddressCard } from './AddressCard';

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
        console.debug("data:", data)
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
            <AddressCard key={address.id} address={address} onSetDefault={onSetDefault} onDeleteAddress={onDeleteAddress} handleEdit={handleEdit} />
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
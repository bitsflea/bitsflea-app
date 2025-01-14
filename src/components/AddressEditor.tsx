import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Address } from '../types';
import { LocationSelector } from './LocationSelector';
import { LocationValue } from '../types';
import { locationData } from '../data/locations';

interface AddressEditorProps {
  onClose: () => void;
  onSave: (address: Address) => void;
  initialData?: Address;
}

export const AddressEditor: React.FC<AddressEditorProps> = ({
  onClose,
  onSave,
  initialData
}) => {
  const firstCountry = Object.keys(locationData)[0];
  const firstRegion = Object.keys(locationData[firstCountry].regions)[0];
  const regionData = locationData[firstCountry].regions[firstRegion];
  const firstDistrict = regionData.districts ? Object.keys(regionData.districts)[0] : undefined;

  const [formData, setFormData] = useState<Address>(initialData || {
    id: Date.now(),
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    isDefault: false
  });

  const [location, setLocation] = useState<LocationValue>({
    country: firstCountry,
    region: firstRegion,
    district: firstDistrict,
    coordinates: firstDistrict && regionData.districts 
      ? regionData.districts[firstDistrict]
      : regionData.coordinates
  });

  const handleLocationChange = (newLocation: LocationValue) => {
    setLocation(newLocation);
    setFormData(prev => ({
      ...prev,
      province: locationData[newLocation.country].name,
      city: locationData[newLocation.country].regions[newLocation.region].name,
      district: newLocation.district || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Address' : 'Add Address'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* 收货人 */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter recipient name"
                required
              />
            </div>

            {/* 手机号码 */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Location Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <LocationSelector
              value={location}
              onChange={handleLocationChange}
            />
          </div>

          {/* 详细地址 */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Detailed Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Street, building, apartment number, etc."
              required
            />
          </div>

          {/* 设为默认地址 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Save Address
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
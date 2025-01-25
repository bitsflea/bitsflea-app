import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { categories } from '../data/categories';
import { LocationSelector } from './LocationSelector';
import { LocationValue, ProductStatus } from '../types';
import { locationData } from '../data/locations';
import config from '../data/config';
// import { addImages } from '../utils/ipfs';
// import { useHelia } from '../context/HeliaContext';

interface ProductPublishProps {
  onClose: () => void;
  onPublish: (data: any) => void;
}

const currencies = config.currencies;

export const ProductPublish: React.FC<ProductPublishProps> = ({ onClose, onPublish }) => {
  const firstCountry = Object.keys(locationData)[0];
  const firstRegion = Object.keys(locationData[firstCountry].regions)[0];
  const regionData = locationData[firstCountry].regions[firstRegion];
  const firstDistrict = regionData.districts ? Object.keys(regionData.districts)[0] : undefined;
  // const ctx = useHelia();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: currencies[0].label,
    shippingFee: '',
    category: categories[1].value,
    images: [] as string[],
    location: {
      country: firstCountry,
      region: firstRegion,
      district: firstDistrict,
      coordinates: firstDistrict && regionData.districts
        ? regionData.districts[firstDistrict]
        : regionData.coordinates
    } as LocationValue
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // addImages(ctx, files).then(images => {console.log(images)});
    const remainingSlots = 5 - formData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string].slice(0, 5)
        }));
      };
      reader.readAsDataURL(file);
    });

    // 清空 input 的值，这样用户可以重复选择同一张图片
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleLocationChange = (location: LocationValue) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish({
      ...formData,
      price: parseFloat(formData.price),
      shippingFee: parseFloat(formData.shippingFee),
      status: ProductStatus.PUBLISH
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Publish Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200
                             hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="border-2 border-dashed border-gray-200 rounded-lg aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                  <span className="text-xs text-gray-400">
                    {formData.images.length}/5 images
                  </span>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">Upload up to 5 images, recommended size 800x800px</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: Number(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.filter(v => v.value != null).map(({ name,value }) => (
                    <option key={name} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price with Currency */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.000001"
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-24 px-2 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                  >
                    {currencies.map(({ value, label }) => (
                      <option key={value} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shipping Fee */}
              <div>
                <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Fee
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="shippingFee"
                    value={formData.shippingFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.000001"
                    required
                  />
                  <div className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-center">
                    {formData.currency}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Describe the condition, usage history, and other details"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Selector */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium text-gray-900">Shipping Location</h3>
            <LocationSelector
              value={formData.location}
              onChange={handleLocationChange}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100"
            >
              Publish
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
import React, { useState, useEffect } from 'react';
import { locationData } from '../data/locations';
import { LocationValue } from '../types';

interface LocationSelectorProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [selectedCountry, setSelectedCountry] = useState(value.country);
  const [selectedRegion, setSelectedRegion] = useState(value.region);
  const [selectedDistrict, setSelectedDistrict] = useState(value.district);

  const countryData = locationData[selectedCountry];
  const regionData = countryData?.regions[selectedRegion];
  const hasDistricts = regionData?.districts && Object.keys(regionData.districts).length > 0;

  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      const region = locationData[selectedCountry].regions[selectedRegion];
      const coordinates = selectedDistrict && region.districts
        ? region.districts[selectedDistrict]
        : region.coordinates;

      onChange({
        country: selectedCountry,
        region: selectedRegion,
        district: selectedDistrict,
        coordinates
      });
    }
  }, [selectedCountry, selectedRegion, selectedDistrict]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    const firstRegion = Object.keys(locationData[country].regions)[0];
    const region = locationData[country].regions[firstRegion];
    const firstDistrict = region.districts ? Object.keys(region.districts)[0] : undefined;

    setSelectedCountry(country);
    setSelectedRegion(firstRegion);
    setSelectedDistrict(firstDistrict);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    const regionData = locationData[selectedCountry].regions[region];
    const firstDistrict = regionData.districts ? Object.keys(regionData.districts)[0] : undefined;

    setSelectedRegion(region);
    setSelectedDistrict(firstDistrict);
  };

  return (
    <div className={`grid gap-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country/Region
          </label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Object.entries(locationData).map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province
          </label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Object.entries(countryData.regions).map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        {hasDistricts && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/District
            </label>
            <select
              value={selectedDistrict || ''}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.keys(regionData.districts!).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { LocationValue } from '../types';
import { MapPin } from 'lucide-react';
import { b64uDec } from '../utils/tools';
import config from '../data/config';

declare global {
    interface Window {
        google: any;
        initGoogleMaps?: () => void;
    }
}

interface GoogleMapsLocationSelectorProps {
    value: LocationValue;
    onChange: (value: LocationValue) => void;
    className?: string;
}

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = b64uDec(config.googleAPIKey);

let googleMapsScriptLoaded = false;

export const GoogleMapsLocationSelector: React.FC<GoogleMapsLocationSelectorProps> = ({
    value,
    onChange,
    className = ''
}) => {
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationValue>(value);
    const [mapLoaded, setMapLoaded] = useState(false);

    const servicesRef = useRef<{
        autocomplete: google.maps.places.AutocompleteService | null;
        places: google.maps.places.PlacesService | null;
        geocoder: google.maps.Geocoder | null;
    }>({
        autocomplete: null,
        places: null,
        geocoder: null
    });

    // Initialize Google Maps
    const initServices = useCallback(() => {
        if (!window.google) return;

        const mapDiv = document.createElement('div');
        const map = new window.google.maps.Map(mapDiv);

        servicesRef.current = {
            autocomplete: new window.google.maps.places.AutocompleteService(),
            places: new window.google.maps.places.PlacesService(map),
            geocoder: new window.google.maps.Geocoder()
        };

        setMapLoaded(true);
    }, []);

    useEffect(() => {
        if (googleMapsScriptLoaded) {
            if (window.google) {
                initServices();
            }
            return;
        }

        window.initGoogleMaps = () => {
            initServices();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        googleMapsScriptLoaded = true;

        return () => {
            delete window.initGoogleMaps;
        };
    }, [initServices]);

    // Handle search suggestions
    const handleSearch = useCallback((value: string) => {
        const { autocomplete } = servicesRef.current;
        if (!autocomplete || !value) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        autocomplete.getPlacePredictions(
            {
                input: value,
                types: ['establishment', 'geocode'] // 允许搜索地点和地址
            },
            (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            }
        );
    }, []);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSearch(searchText);
        }, 300); // 减少延迟以提高响应速度

        return () => clearTimeout(timeout);
    }, [searchText, handleSearch]);

    const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
        const { places, geocoder } = servicesRef.current;
        if (!places || !geocoder) return;

        setSearchText(suggestion.description);
        setShowSuggestions(false);

        places.getDetails(
            {
                placeId: suggestion.place_id,
                fields: ['geometry', 'address_components', 'formatted_address']
            },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    let country = '';
                    let region = '';
                    let district = '';

                    place.address_components?.forEach(component => {
                        if (component.types.includes('country')) {
                            country = component.short_name;
                        }
                        if (component.types.includes('administrative_area_level_1')) {
                            region = component.long_name;
                        }
                        if (component.types.includes('locality') ||
                            component.types.includes('administrative_area_level_2') ||
                            component.types.includes('sublocality_level_1')) {
                            district = component.long_name;
                        }
                    });

                    const newLocation: LocationValue = {
                        country: country || 'Unknown',
                        region: region || 'Unknown',
                        district: district || '',
                        coordinates: {
                            lat: place.geometry?.location?.lat() || 0,
                            lng: place.geometry?.location?.lng() || 0
                        }
                    };

                    setSelectedLocation(newLocation);
                    onChange(newLocation);
                }
            }
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={mapLoaded ? "Search location..." : "Loading map..."}
                        disabled={!mapLoaded}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium text-gray-900">{suggestion.structured_formatting.main_text}</div>
                                <div className="text-sm text-gray-500">{suggestion.structured_formatting.secondary_text}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedLocation && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Country:</span>
                        <span className="text-gray-900">{selectedLocation.country}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Region:</span>
                        <span className="text-gray-900">{selectedLocation.region}</span>
                    </div>
                    {selectedLocation.district && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">District:</span>
                            <span className="text-gray-900">{selectedLocation.district}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coordinates:</span>
                        <span className="text-gray-900">
                            {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
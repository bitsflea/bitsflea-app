declare namespace google.maps {
    namespace places {
        interface AutocompletePrediction {
            place_id: string;
            description: string;
            structured_formatting: {
                main_text: string;
                secondary_text: string;
            };
        }

        interface PlaceResult {
            place_id?: string;
            geometry?: {
                location?: {
                    lat(): number;
                    lng(): number;
                };
            };
            address_components?: {
                long_name: string;
                short_name: string;
                types: string[];
            }[];
        }

        enum PlacesServiceStatus {
            OK = 'OK',
            ZERO_RESULTS = 'ZERO_RESULTS',
            OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
            REQUEST_DENIED = 'REQUEST_DENIED',
            INVALID_REQUEST = 'INVALID_REQUEST'
        }

        class AutocompleteService {
            getPlacePredictions(
                request: {
                    input: string;
                    types?: string[];
                    componentRestrictions?: { country: string };
                },
                callback: (
                    predictions: AutocompletePrediction[] | null,
                    status: PlacesServiceStatus
                ) => void
            ): void;
        }

        class PlacesService {
            constructor(attrContainer: Element | Map);
            getDetails(
                request: {
                    placeId: string;
                    fields?: string[];
                },
                callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
            ): void;
        }
    }

    class Geocoder {
        geocode(
            request: {
                address?: string;
                location?: { lat: number; lng: number };
            },
            callback: (
                results: GeocoderResult[],
                status: GeocoderStatus
            ) => void
        ): void;
    }

    class Map {
        constructor(mapDiv: Element | null, opts?: MapOptions);
    }

    interface MapOptions {
        center?: { lat: number; lng: number };
        zoom?: number;
    }

    interface GeocoderResult {
        geometry: {
            location: {
                lat(): number;
                lng(): number;
            };
        };
    }

    enum GeocoderStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST'
    }
}
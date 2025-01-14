import { RegionData } from '../types';

export const locationData: { [key: string]: RegionData } = {
  CN: {
    name: '中国',
    regions: {
      'Beijing': {
        name: '北京市',
        coordinates: { lat: 39.9042, lng: 116.4074 },
        districts: {
          'Chaoyang': { lat: 39.9219, lng: 116.4437 },
          'Haidian': { lat: 39.9946, lng: 116.2988 },
          'Dongcheng': { lat: 39.9289, lng: 116.4160 }
        }
      },
      'Shanghai': {
        name: '上海市',
        coordinates: { lat: 31.2304, lng: 121.4737 },
        districts: {
          'Pudong': { lat: 31.2304, lng: 121.5435 },
          'Huangpu': { lat: 31.2277, lng: 121.4852 },
          'Jing\'an': { lat: 31.2304, lng: 121.4737 }
        }
      },
      'Guangdong': {
        name: '广东省',
        coordinates: { lat: 23.1357, lng: 113.2587 },
        districts: {
          'Guangzhou': { lat: 23.1291, lng: 113.2644 },
          'Shenzhen': { lat: 22.5431, lng: 114.0579 },
          'Dongguan': { lat: 23.0489, lng: 113.7447 }
        }
      }
    }
  },
  US: {
    name: 'United States',
    regions: {
      'California': {
        name: 'California',
        coordinates: { lat: 36.7783, lng: -119.4179 },
        districts: {
          'Los Angeles': { lat: 34.0522, lng: -118.2437 },
          'San Francisco': { lat: 37.7749, lng: -122.4194 },
          'San Diego': { lat: 32.7157, lng: -117.1611 }
        }
      },
      'New York': {
        name: 'New York',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        districts: {
          'Manhattan': { lat: 40.7831, lng: -73.9712 },
          'Brooklyn': { lat: 40.6782, lng: -73.9442 },
          'Queens': { lat: 40.7282, lng: -73.7949 }
        }
      },
      'Texas': {
        name: 'Texas',
        coordinates: { lat: 31.9686, lng: -99.9018 },
        districts: {
          'Houston': { lat: 29.7604, lng: -95.3698 },
          'Dallas': { lat: 32.7767, lng: -96.7970 },
          'Austin': { lat: 30.2672, lng: -97.7431 }
        }
      }
    }
  },
  GB: {
    name: 'United Kingdom',
    regions: {
      'England': {
        name: 'England',
        coordinates: { lat: 52.3555, lng: -1.1743 },
        districts: {
          'London': { lat: 51.5074, lng: -0.1278 },
          'Manchester': { lat: 53.4808, lng: -2.2426 },
          'Birmingham': { lat: 52.4862, lng: -1.8904 }
        }
      },
      'Scotland': {
        name: 'Scotland',
        coordinates: { lat: 56.4907, lng: -4.2026 },
        districts: {
          'Edinburgh': { lat: 55.9533, lng: -3.1883 },
          'Glasgow': { lat: 55.8642, lng: -4.2518 },
          'Aberdeen': { lat: 57.1497, lng: -2.0943 }
        }
      }
    }
  },
  FR: {
    name: 'France',
    regions: {
      'Île-de-France': {
        name: 'Île-de-France',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        districts: {
          'Paris': { lat: 48.8566, lng: 2.3522 },
          'Versailles': { lat: 48.8044, lng: 2.1232 },
          'Saint-Denis': { lat: 48.9358, lng: 2.3596 }
        }
      },
      'Provence-Alpes-Côte d\'Azur': {
        name: 'Provence-Alpes-Côte d\'Azur',
        coordinates: { lat: 43.9351, lng: 6.0679 },
        districts: {
          'Nice': { lat: 43.7102, lng: 7.2620 },
          'Marseille': { lat: 43.2965, lng: 5.3698 },
          'Cannes': { lat: 43.5528, lng: 7.0174 }
        }
      }
    }
  },
  DE: {
    name: 'Germany',
    regions: {
      'Berlin': {
        name: 'Berlin',
        coordinates: { lat: 52.5200, lng: 13.4050 },
        districts: {
          'Mitte': { lat: 52.5200, lng: 13.4050 },
          'Kreuzberg': { lat: 52.4977, lng: 13.4174 },
          'Charlottenburg': { lat: 52.5157, lng: 13.3054 }
        }
      },
      'Bavaria': {
        name: 'Bavaria',
        coordinates: { lat: 48.7904, lng: 11.4979 },
        districts: {
          'Munich': { lat: 48.1351, lng: 11.5820 },
          'Nuremberg': { lat: 49.4521, lng: 11.0767 },
          'Augsburg': { lat: 48.3705, lng: 10.8978 }
        }
      }
    }
  },
  SG: {
    name: 'Singapore',
    regions: {
      'Central Region': {
        name: 'Central Region',
        coordinates: { lat: 1.3521, lng: 103.8198 },
        districts: {
          'Downtown Core': { lat: 1.2789, lng: 103.8536 },
          'Orchard': { lat: 1.3047, lng: 103.8321 },
          'Marina Bay': { lat: 1.2817, lng: 103.8636 }
        }
      },
      'East Region': {
        name: 'East Region',
        coordinates: { lat: 1.3236, lng: 103.9273 },
        districts: {
          'Changi': { lat: 1.3644, lng: 103.9915 },
          'Bedok': { lat: 1.3236, lng: 103.9273 },
          'Tampines': { lat: 1.3496, lng: 103.9568 }
        }
      }
    }
  },
  MY: {
    name: 'Malaysia',
    regions: {
      'Kuala Lumpur': {
        name: 'Kuala Lumpur',
        coordinates: { lat: 3.1390, lng: 101.6869 },
        districts: {
          'KLCC': { lat: 3.1579, lng: 101.7120 },
          'Bukit Bintang': { lat: 3.1488, lng: 101.7137 },
          'Chow Kit': { lat: 3.1641, lng: 101.6997 }
        }
      },
      'Selangor': {
        name: 'Selangor',
        coordinates: { lat: 3.0738, lng: 101.5183 },
        districts: {
          'Petaling Jaya': { lat: 3.1067, lng: 101.6056 },
          'Shah Alam': { lat: 3.0733, lng: 101.5185 },
          'Subang Jaya': { lat: 3.0495, lng: 101.5854 }
        }
      }
    }
  },
  TH: {
    name: 'Thailand',
    regions: {
      'Bangkok': {
        name: 'กรุงเทพมหานคร',
        coordinates: { lat: 13.7563, lng: 100.5018 },
        districts: {
          'Sukhumvit': { lat: 13.7380, lng: 100.5608 },
          'Siam': { lat: 13.7455, lng: 100.5333 },
          'Silom': { lat: 13.7262, lng: 100.5149 }
        }
      },
      'Chiang Mai': {
        name: 'เชียงใหม่',
        coordinates: { lat: 18.7883, lng: 98.9853 },
        districts: {
          'Old City': { lat: 18.7884, lng: 98.9853 },
          'Nimman': { lat: 18.8018, lng: 98.9692 },
          'Santitham': { lat: 18.8033, lng: 98.9817 }
        }
      }
    }
  },
  ID: {
    name: 'Indonesia',
    regions: {
      'Jakarta': {
        name: 'Jakarta',
        coordinates: { lat: -6.2088, lng: 106.8456 },
        districts: {
          'Central Jakarta': { lat: -6.1751, lng: 106.8451 },
          'South Jakarta': { lat: -6.2615, lng: 106.8106 },
          'North Jakarta': { lat: -6.1211, lng: 106.8845 }
        }
      },
      'Bali': {
        name: 'Bali',
        coordinates: { lat: -8.3405, lng: 115.0920 },
        districts: {
          'Denpasar': { lat: -8.6705, lng: 115.2126 },
          'Ubud': { lat: -8.5069, lng: 115.2625 },
          'Kuta': { lat: -8.7215, lng: 115.1689 }
        }
      }
    }
  }
};
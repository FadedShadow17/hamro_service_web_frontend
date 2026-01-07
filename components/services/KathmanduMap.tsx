'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface KathmanduMapProps {
  selectedArea: string;
  onAreaSelect: (area: string) => void;
}

// Kathmandu Valley area coordinates (approximate)
const KATHMANDU_AREAS = [
  // Kathmandu District - Central Areas
  { name: 'Thamel', lat: 27.7150, lng: 85.3100 },
  { name: 'New Road', lat: 27.7050, lng: 85.3150 },
  { name: 'Durbar Marg', lat: 27.7100, lng: 85.3120 },
  { name: 'Lazimpat', lat: 27.7200, lng: 85.3150 },
  { name: 'Naxal', lat: 27.7180, lng: 85.3180 },
  { name: 'Kalimati', lat: 27.7000, lng: 85.3100 },
  { name: 'Kalimati Chowk', lat: 27.6980, lng: 85.3080 },
  { name: 'Kalanki', lat: 27.6900, lng: 85.2800 },
  { name: 'Kalanki Chowk', lat: 27.6880, lng: 85.2780 },
  
  // Kathmandu District - East Areas
  { name: 'Baneshwor', lat: 27.6870, lng: 85.3330 },
  { name: 'Koteshwor', lat: 27.6750, lng: 85.3450 },
  { name: 'Chabahil', lat: 27.7100, lng: 85.3500 },
  { name: 'Boudha', lat: 27.7200, lng: 85.3600 },
  { name: 'Jorpati', lat: 27.7250, lng: 85.3550 },
  { name: 'Gokarna', lat: 27.7300, lng: 85.3650 },
  { name: 'Budhanilkantha', lat: 27.7800, lng: 85.3600 },
  { name: 'Tokha', lat: 27.7500, lng: 85.3300 },
  { name: 'Gongabu', lat: 27.7350, lng: 85.3250 },
  { name: 'Balkumari', lat: 27.6800, lng: 85.3400 },
  { name: 'Sinamangal', lat: 27.6900, lng: 85.3500 },
  { name: 'Tinkune', lat: 27.6850, lng: 85.3450 },
  { name: 'Airport Area', lat: 27.6950, lng: 85.3550 },
  
  // Kathmandu District - North Areas
  { name: 'Balaju', lat: 27.7200, lng: 85.3000 },
  { name: 'Maharajgunj', lat: 27.7300, lng: 85.3200 },
  { name: 'Swayambhu', lat: 27.7150, lng: 85.2900 },
  { name: 'Kapan', lat: 27.7400, lng: 85.3450 },
  { name: 'Budhanilkantha', lat: 27.7800, lng: 85.3600 },
  { name: 'Tarakeshwor', lat: 27.7600, lng: 85.3400 },
  { name: 'Kapan Chowk', lat: 27.7380, lng: 85.3430 },
  { name: 'Buddhanagar', lat: 27.7250, lng: 85.3350 },
  
  // Kathmandu District - West Areas
  { name: 'Kalimati', lat: 27.7000, lng: 85.3100 },
  { name: 'Teku', lat: 27.6950, lng: 85.3050 },
  { name: 'Kalimati Chowk', lat: 27.6980, lng: 85.3080 },
  { name: 'Kalimati Mandala', lat: 27.7020, lng: 85.3080 },
  
  // Lalitpur District (Patan)
  { name: 'Patan Durbar Square', lat: 27.6730, lng: 85.3240 },
  { name: 'Lagankhel', lat: 27.6700, lng: 85.3200 },
  { name: 'Jawalakhel', lat: 27.6650, lng: 85.3150 },
  { name: 'Kupondole', lat: 27.6750, lng: 85.3100 },
  { name: 'Pulchowk', lat: 27.6800, lng: 85.3180 },
  { name: 'Sanepa', lat: 27.6720, lng: 85.3120 },
  { name: 'Thapathali', lat: 27.6900, lng: 85.3200 },
  { name: 'Satungal', lat: 27.7100, lng: 85.2800 },
  { name: 'Imadol', lat: 27.6500, lng: 85.3300 },
  { name: 'Nakhipot', lat: 27.6550, lng: 85.3250 },
  { name: 'Bhaisepati', lat: 27.6600, lng: 85.3400 },
  { name: 'Satdobato', lat: 27.6650, lng: 85.3450 },
  { name: 'Kumaripati', lat: 27.6680, lng: 85.3220 },
  { name: 'Mangal Bazar', lat: 27.6710, lng: 85.3260 },
  
  // Bhaktapur District
  { name: 'Bhaktapur Durbar Square', lat: 27.6710, lng: 85.4280 },
  { name: 'Thimi', lat: 27.6800, lng: 85.3800 },
  { name: 'Suryabinayak', lat: 27.6500, lng: 85.4200 },
  { name: 'Madhyapur Thimi', lat: 27.6820, lng: 85.3820 },
  { name: 'Changunarayan', lat: 27.7150, lng: 85.4300 },
  
  // Additional Areas
  { name: 'Kirtipur', lat: 27.6750, lng: 85.2750 },
  { name: 'Chandragiri', lat: 27.6500, lng: 85.2500 },
  { name: 'Thankot', lat: 27.7000, lng: 85.2700 },
  { name: 'Naikap', lat: 27.7500, lng: 85.3000 },
  { name: 'Sankhu', lat: 27.7800, lng: 85.4000 },
];

// Kathmandu Valley bounds
const KATHMANDU_CENTER: [number, number] = [27.7172, 85.3240];
const KATHMANDU_BOUNDS: [[number, number], [number, number]] = [
  [27.6, 85.2], // Southwest
  [27.8, 85.45], // Northeast
];

// Fix for default Leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Custom marker icon for selected location
const createCustomIcon = (color: string = '#69E6A6') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to handle map clicks
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

// Component to center map on location
function MapCenterHandler({ center }: { center: [number, number] | null }) {
  const map = useMap();
  if (center) {
    map.setView(center, 13);
  }
  return null;
}

export function KathmanduMap({ selectedArea, onAreaSelect }: KathmanduMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest area from coordinates
  const findNearestArea = (lat: number, lng: number): string | null => {
    let minDistance = Infinity;
    let nearest = null;

    KATHMANDU_AREAS.forEach((area) => {
      const distance = calculateDistance(lat, lng, area.lat, area.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = area.name;
      }
    });

    return nearest;
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setLocationError(null);
    
    const nearestArea = findNearestArea(lat, lng);
    if (nearestArea) {
      setSelectedAreaName(nearestArea);
      onAreaSelect(nearestArea);
    }
  };

  // Handle use my location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          
          // Find nearest area
          const nearestArea = findNearestArea(latitude, longitude);
          if (nearestArea) {
            setSelectedAreaName(nearestArea);
            onAreaSelect(nearestArea);
          }

          // Center map on user location
          setMapCenter([latitude, longitude]);
          // Reset center after a moment to allow re-centering
          setTimeout(() => setMapCenter(null), 100);
        },
        (error) => {
          setLocationError('Unable to get your location. Please allow location access.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/20 bg-[#0A2640]">
        <MapContainer
          center={KATHMANDU_CENTER}
          zoom={12}
          minZoom={11}
          maxZoom={16}
          maxBounds={KATHMANDU_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {mapCenter && <MapCenterHandler center={mapCenter} />}
          
          {/* Selected location marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createCustomIcon('#69E6A6')}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-[#0A2640]">
                    {selectedAreaName || 'Selected Location'}
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User location marker (if different from selected) */}
          {userLocation && 
           selectedLocation && 
           (userLocation.lat !== selectedLocation.lat || userLocation.lng !== selectedLocation.lng) && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#3B82F6')}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-[#0A2640]">Your Current Location</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Controls and Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="px-3 py-2 rounded-lg bg-[#0A2640] border border-white/20 text-white/80 hover:text-white hover:border-[#69E6A6]/50 transition-all text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
          
          {locationError && (
            <p className="text-xs text-red-400">{locationError}</p>
          )}
        </div>

        {selectedAreaName && (
          <div className="px-3 py-2 rounded-lg bg-[#69E6A6]/10 border border-[#69E6A6]/30">
            <p className="text-sm text-[#69E6A6] font-medium">
              Selected Location: <span className="text-white">{selectedAreaName}</span>
            </p>
            <p className="text-xs text-white/60 mt-1">
              Click anywhere on the map to change location
            </p>
          </div>
        )}

        {!selectedAreaName && (
          <div className="px-3 py-2 rounded-lg bg-[#0A2640] border border-white/20">
            <p className="text-xs text-white/60">
              Click on the map or use "Use My Location" to select your location
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

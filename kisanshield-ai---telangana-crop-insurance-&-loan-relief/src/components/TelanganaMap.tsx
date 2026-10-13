import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TELANGANA_BOUNDS, TELANGANA_DISTRICTS, isWithinTelangana } from '../data/telangana';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Layers, AlertCircle, CheckCircle2, Search, Compass } from 'lucide-react';

// Custom icons
const defaultPinIcon = L.divIcon({
  className: 'custom-farm-marker',
  html: `<div style="background-color: #153E32; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

const damagedPinIcon = L.divIcon({
  className: 'custom-damaged-marker',
  html: `<div style="background-color: #B45309; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

interface TelanganaMapProps {
  selectedLocation?: { lat: number; lng: number; name?: string; acres?: number };
  onLocationSelect?: (lat: number, lng: number, districtName?: string, villageName?: string) => void;
  showDistrictPins?: boolean;
  isDamaged?: boolean;
  heightClass?: string;
  readOnly?: boolean;
  selectedDistrict?: string;
  selectedVillage?: string;
}

export const TelanganaMap: React.FC<TelanganaMapProps> = ({
  selectedLocation,
  onLocationSelect,
  showDistrictPins = true,
  isDamaged = false,
  heightClass = 'h-[360px]',
  readOnly = false,
  selectedDistrict: propDistrict,
  selectedVillage: propVillage,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const farmMarkerRef = useRef<L.Marker | null>(null);
  const farmPolygonRef = useRef<L.Polygon | null>(null);
  const [ndviOverlay, setNdviOverlay] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [activeDistrictId, setActiveDistrictId] = useState<string>(propDistrict || 'warangal');
  const [activeVillage, setActiveVillage] = useState<string>(propVillage || '');
  const { language } = useLanguage();

  const currentDistObj = TELANGANA_DISTRICTS.find(
    (d) => d.id === activeDistrictId || d.name.toLowerCase() === activeDistrictId.toLowerCase()
  ) || TELANGANA_DISTRICTS[0];

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Strict Telangana bounds
    const telanganaBounds = L.latLngBounds(
      L.latLng(TELANGANA_BOUNDS.minLat - 0.2, TELANGANA_BOUNDS.minLng - 0.2),
      L.latLng(TELANGANA_BOUNDS.maxLat + 0.2, TELANGANA_BOUNDS.maxLng + 0.2)
    );

    const map = L.map(mapContainerRef.current, {
      center: selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : TELANGANA_BOUNDS.center,
      zoom: selectedLocation ? 10 : TELANGANA_BOUNDS.defaultZoom,
      minZoom: 6.5,
      maxZoom: 16,
      maxBounds: telanganaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Draw rough Telangana perimeter guideline
    const telanganaOutlineCoords: [number, number][] = [
      [19.90, 78.50],
      [19.60, 79.90],
      [18.90, 80.50],
      [17.80, 81.30],
      [17.20, 80.80],
      [16.80, 79.90],
      [16.20, 79.00],
      [15.90, 78.20],
      [16.40, 77.40],
      [17.30, 77.30],
      [18.20, 77.60],
      [19.00, 77.80],
      [19.90, 78.50],
    ];

    L.polygon(telanganaOutlineCoords, {
      color: '#3B7C61',
      weight: 1.5,
      fill: false,
      dashArray: '5, 5',
      opacity: 0.5,
    }).addTo(map);

    // Render district markers if enabled
    if (showDistrictPins) {
      TELANGANA_DISTRICTS.forEach((dist) => {
        const marker = L.circleMarker([dist.lat, dist.lng], {
          radius: 5,
          fillColor: dist.climateRiskScore === 'Severe' ? '#DC2626' : '#3B7C61',
          color: '#FFFFFF',
          weight: 2,
          fillOpacity: 0.85,
        }).addTo(map);

        marker.bindTooltip(
          `<strong>${language === 'te' ? dist.nameTe : dist.name}</strong><br/>${language === 'te' ? 'వాతావరణ ముప్పు' : 'Climate Risk'}: ${dist.climateRiskScore}<br/>${dist.prominentVillages.slice(0, 3).join(', ')}`,
          { direction: 'top', className: 'text-xs' }
        );

        marker.on('click', () => {
          if (!readOnly && onLocationSelect) {
            setActiveDistrictId(dist.id);
            const firstVillage = dist.prominentVillages[0] || 'Main Village';
            setActiveVillage(firstVillage);
            onLocationSelect(dist.lat, dist.lng, dist.name, firstVillage);
          }
        });
      });
    }

    // Map click handler for picking location
    if (!readOnly && onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (!isWithinTelangana(lat, lng)) {
          setWarningMessage(
            language === 'te'
              ? `క్షమించండి! ఎంచుకున్న అక్షాంశాలు (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E) తెలంగాణ రాష్ట్ర సరిహద్దుల వెలుపల ఉన్నాయి. దయచేసి తెలంగాణ లోపల స్థానాన్ని ఎంచుకోండి.`
              : `Point (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E) is outside Telangana boundaries (15.80°-19.92°N, 77.20°-81.82°E). Pick a point within Telangana.`
          );
          setTimeout(() => setWarningMessage(null), 5000);
          return;
        }

        setWarningMessage(null);
        // Find closest district name
        let closestDistrict = TELANGANA_DISTRICTS[0];
        let minDist = Infinity;
        TELANGANA_DISTRICTS.forEach((d) => {
          const dist = Math.hypot(d.lat - lat, d.lng - lng);
          if (dist < minDist) {
            minDist = dist;
            closestDistrict = d;
          }
        });

        setActiveDistrictId(closestDistrict.id);
        const autoVillage = closestDistrict.prominentVillages[0] || 'Main Village';
        setActiveVillage(autoVillage);

        onLocationSelect(
          Math.round(lat * 10000) / 10000,
          Math.round(lng * 10000) / 10000,
          closestDistrict.name,
          autoVillage
        );
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update selected farm pin and polygon boundary
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const lat = selectedLocation.lat;
      const lng = selectedLocation.lng;

      // Coordinate validation check
      const isValid = isWithinTelangana(lat, lng);
      if (!isValid) {
        setWarningMessage(
          language === 'te'
            ? `అక్షాంశాలు (${lat}°N, ${lng}°E) తెలంగాణ రాష్ట్ర పరిధిలో లేవు!`
            : `Coordinates (${lat}°N, ${lng}°E) violate Telangana State boundary bounds!`
        );
        return;
      }

      if (farmMarkerRef.current) {
        farmMarkerRef.current.setLatLng([lat, lng]);
      } else {
        farmMarkerRef.current = L.marker([lat, lng], {
          icon: isDamaged ? damagedPinIcon : defaultPinIcon,
        }).addTo(map);
      }

      // Add popup with parcel details
      farmMarkerRef.current.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #153E32;">${selectedLocation.name || 'Farmer Parcel'}</strong><br/>
          <span>${selectedLocation.acres || 2.5} Acres • Survey Boundary</span><br/>
          <span style="font-family: monospace; font-size: 11px; color: #555;">${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</span><br/>
          <span style="color: #3B7C61; font-weight: 600;">✓ Verified Telangana Geo-Coordinates</span>
        </div>`
      );

      // Draw field parcel polygon around the pin
      const offset = selectedLocation.acres
        ? Math.min(0.008, Math.max(0.002, Math.sqrt(selectedLocation.acres) * 0.0015))
        : 0.0035;
      const polygonCoords: [number, number][] = [
        [lat - offset * 0.8, lng - offset],
        [lat + offset * 0.9, lng - offset * 0.6],
        [lat + offset, lng + offset * 0.8],
        [lat - offset * 0.7, lng + offset * 0.7],
      ];

      if (farmPolygonRef.current) {
        farmPolygonRef.current.setLatLngs(polygonCoords);
      } else {
        farmPolygonRef.current = L.polygon(polygonCoords, {
          color: isDamaged ? '#B45309' : '#153E32',
          fillColor: isDamaged ? (ndviOverlay ? '#EF4444' : '#F59E0B') : (ndviOverlay ? '#10B981' : '#3B7C61'),
          fillOpacity: ndviOverlay ? 0.6 : 0.25,
          weight: 2,
          dashArray: '4, 4',
        }).addTo(map);
      }

      // Smooth synchronized pan to selected parcel
      map.flyTo([lat, lng], Math.max(map.getZoom(), 11), { duration: 0.6 });
    } else {
      if (farmMarkerRef.current) {
        farmMarkerRef.current.remove();
        farmMarkerRef.current = null;
      }
      if (farmPolygonRef.current) {
        farmPolygonRef.current.remove();
        farmPolygonRef.current = null;
      }
    }
  }, [selectedLocation, isDamaged, ndviOverlay]);

  // Handle district jump from dropdown
  const handleDistrictChange = (distId: string) => {
    setActiveDistrictId(distId);
    const target = TELANGANA_DISTRICTS.find((d) => d.id === distId);
    if (!target) return;
    const v = target.prominentVillages[0] || 'Main Village';
    setActiveVillage(v);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 11, { duration: 0.8 });
    }
    if (!readOnly && onLocationSelect) {
      onLocationSelect(target.lat, target.lng, target.name, v);
    }
  };

  // Handle village jump from dropdown
  const handleVillageChange = (vName: string) => {
    setActiveVillage(vName);
    const target = TELANGANA_DISTRICTS.find((d) => d.id === activeDistrictId);
    if (!target) return;

    // Small offset for selected village
    const vIdx = target.prominentVillages.indexOf(vName);
    const offsetLat = (vIdx % 3 - 1) * 0.02;
    const offsetLng = (Math.floor(vIdx / 3) - 1) * 0.02;
    const vLat = Math.round((target.lat + offsetLat) * 10000) / 10000;
    const vLng = Math.round((target.lng + offsetLng) * 10000) / 10000;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([vLat, vLng], 12, { duration: 0.8 });
    }
    if (!readOnly && onLocationSelect) {
      onLocationSelect(vLat, vLng, target.name, vName);
    }
  };

  const isSelectedCoordValid = selectedLocation
    ? isWithinTelangana(selectedLocation.lat, selectedLocation.lng)
    : true;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#E2DDD0] shadow-sm bg-stone-100 flex flex-col">
      {/* Quick District & Village jump controls (only shown when selectable) */}
      {!readOnly && onLocationSelect && (
        <div className="p-2.5 bg-white border-b border-stone-200 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700 font-semibold shrink-0">
            <Compass className="w-4 h-4 text-[#3B7C61]" />
            <span>{language === 'te' ? 'జిల్లా & గ్రామం ఎంపిక:' : 'District & Village Selection:'}</span>
          </div>

          {/* District selector */}
          <select
            value={activeDistrictId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-800 font-medium focus:outline-none focus:border-[#153E32]"
          >
            {TELANGANA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'te' ? d.nameTe : d.name} ({d.climateRiskScore} Risk)
              </option>
            ))}
          </select>

          {/* Village selector */}
          <select
            value={activeVillage}
            onChange={(e) => handleVillageChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-800 font-medium focus:outline-none focus:border-[#153E32]"
          >
            {currentDistObj.prominentVillages.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Live Coordinate Status Badge */}
          {selectedLocation && (
            <div
              className={`ml-auto px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 ${
                isSelectedCoordValid
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {isSelectedCoordValid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    TS Valid: {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Outside TS Bounds</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative w-full">
        <div ref={mapContainerRef} className={`w-full ${heightClass}`} />

        {/* Top Banner controls */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-2 items-center">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-stone-200 text-xs font-semibold text-[#153E32] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3B7C61]" />
            <span>{language === 'te' ? 'తెలంగాణ సరిహద్దులకు మాత్రమే పరిమితం' : 'Restricted to Telangana, India'}</span>
          </div>

          <button
            type="button"
            onClick={() => setNdviOverlay(!ndviOverlay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              ndviOverlay
                ? 'bg-[#153E32] text-white border border-[#153E32]'
                : 'bg-white/95 text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'సెంటినెల్-2 NDVI లేయర్ (మోడల్)' : 'Sentinel-2 NDVI Overlay'}</span>
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-stone-200 text-[11px] text-stone-600 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#153E32] inline-block"></span>
            <span>{language === 'te' ? 'రైతు పొలం పిన్' : 'Farmer Farm Marker'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border border-[#153E32] border-dashed inline-block"></span>
            <span>{language === 'te' ? 'పొలం సరిహద్దు పాలీగాన్' : 'Parcel Boundary Polygon'}</span>
          </div>
          {ndviOverlay && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
              <span>{language === 'te' ? 'ఆరోగ్యకర పంట (NDVI > 0.6)' : 'Healthy Crop (NDVI > 0.6)'}</span>
            </div>
          )}
          {ndviOverlay && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
              <span>{language === 'te' ? 'నష్టపోయిన పంట (NDVI < 0.35)' : 'Stressed/Damaged (NDVI < 0.35)'}</span>
            </div>
          )}
        </div>

        {/* Warning Alert if click was outside Telangana */}
        {warningMessage && (
          <div className="absolute top-12 left-3 right-3 z-[1100] bg-red-600 text-white px-3.5 py-2.5 rounded-lg shadow-lg text-xs flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

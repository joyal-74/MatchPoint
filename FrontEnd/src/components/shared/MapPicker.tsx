import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Loader2, Navigation, AlertCircle } from "lucide-react";

// --- LEAFLET ICON FIX ---
// const defaultIcon = new L.Icon({
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//     shadowSize: [41, 41]
// });

const activeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
});

// --- HELPER: VALIDATE COORDINATES ---
// This prevents the "NaN" crash by checking if coordinates are valid numbers
const isValidLatLng = (lat: string | number, lng: string | number): boolean => {
    return (
        typeof lat === "number" && 
        typeof lng === "number" && 
        !isNaN(lat) && 
        !isNaN(lng) &&
        Math.abs(lat) <= 90 && 
        Math.abs(lng) <= 180
    );
};

// --- TYPES ---
interface MapPickerProps {
    onSelectLocation: (data: { address: string; lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number; address?: string };
}

// --- SUB-COMPONENT: HANDLES MAP CLICKS ---
function LocationMarker({ onSelectLocation, setMarkerPos }: { 
    onSelectLocation: (data: { address: string; lat: number; lng: number }) => void,
    setMarkerPos: (pos: { lat: number; lng: number }) => void 
}) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setMarkerPos({ lat, lng });

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                onSelectLocation({ 
                    address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`, 
                    lat, 
                    lng 
                });
            } catch (error) {
                console.error("Reverse geocode failed", error);
                onSelectLocation({ address: "Selected Location", lat, lng });
            }
        },
    });
    return null;
}

function MapController({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        // Only fly if center is valid to prevent crashes
        if (center && isValidLatLng(center.lat, center.lng)) {
            map.flyTo(center, 13, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

// --- MAIN COMPONENT ---
export default function MapPicker({ onSelectLocation, initialLocation }: MapPickerProps) {
    // Default Fallback (Center of India)
    const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(() => {
        if (initialLocation && isValidLatLng(initialLocation.lat, initialLocation.lng)) {
            return { lat: initialLocation.lat, lng: initialLocation.lng };
        }
        return null;
    });

    const [viewCenter, setViewCenter] = useState<{ lat: number; lng: number }>(() => {
        if (initialLocation && isValidLatLng(initialLocation.lat, initialLocation.lng)) {
            return { lat: initialLocation.lat, lng: initialLocation.lng };
        }
        return DEFAULT_CENTER;
    });

    useEffect(() => {
        if (initialLocation && isValidLatLng(initialLocation.lat, initialLocation.lng)) {
            setMarkerPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
            setViewCenter({ lat: initialLocation.lat, lng: initialLocation.lng });
        }
    }, [initialLocation]);

    // 1. Handle Text Search
    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchText.trim()) return;

        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
            );
            const results = await response.json();

            if (results.length > 0) {
                const { lat, lon, display_name } = results[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                if (isValidLatLng(newLat, newLng)) {
                    setMarkerPosition({ lat: newLat, lng: newLng });
                    setViewCenter({ lat: newLat, lng: newLng });
                    onSelectLocation({ address: display_name, lat: newLat, lng: newLng });
                } else {
                    setError("Invalid coordinates received from search.");
                }
            } else {
                setError("Location not found.");
            }
        } catch (err) {
            console.log(err)
            setError("Search failed. Check connection.");
        } finally {
            setIsSearching(false);
        }
    };

    // 2. Handle Geolocation
    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            return;
        }

        setIsLocating(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                
                if (!isValidLatLng(lat, lng)) {
                    setError("Received invalid location data.");
                    setIsLocating(false);
                    return;
                }

                setMarkerPosition({ lat, lng });
                setViewCenter({ lat, lng });

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                    );
                    const data = await response.json();
                    onSelectLocation({ 
                        address: data.display_name || "Current Location", 
                        lat, 
                        lng 
                    });
                } catch {
                    onSelectLocation({ address: "Current Location", lat, lng });
                } finally {
                    setIsLocating(false);
                }
            },
            () => {
                setError("Permission denied or unavailable.");
                setIsLocating(false);
            }
        );
    };

    return (
        <div className="space-y-3 w-full">
            {/* Search Bar */}
            <div className="flex gap-2">
                <form onSubmit={handleSearch} className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search for a city or area..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                    )}
                </form>
                <button 
                    type="button"
                    onClick={() => handleSearch()}
                    disabled={isSearching || !searchText}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-input rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Search
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            {/* Map Container */}
            <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-border shadow-sm group">
                <MapContainer 
                    center={isValidLatLng(viewCenter.lat, viewCenter.lng) ? viewCenter : DEFAULT_CENTER} 
                    zoom={13} 
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <MapController center={viewCenter} />
                    <LocationMarker onSelectLocation={onSelectLocation} setMarkerPos={setMarkerPosition} />

                    {/* Only render Marker if position is valid */}
                    {markerPosition && isValidLatLng(markerPosition.lat, markerPosition.lng) && (
                        <Marker position={markerPosition} icon={activeIcon} />
                    )}
                </MapContainer>

                {/* Floating "Locate Me" Button */}
                <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className="absolute top-3 right-3 z-[400] p-2 bg-background/90 backdrop-blur text-foreground rounded-lg shadow-md border border-border/50 hover:bg-background transition-all disabled:opacity-70"
                    title="Use Current Location"
                >
                    {isLocating ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                        <Navigation className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                </button>

                {/* Overlay Instruction */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[400] px-3 py-1 bg-background/80 backdrop-blur rounded-full border border-border/50 shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                        <MapPin size={10} /> Click map to pin location
                    </p>
                </div>
            </div>
        </div>
    );
}
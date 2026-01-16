import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Loader2 } from "lucide-react"; // Using Lucide icons for consistency

interface MapPickerProps {
    onSelectLocation: (data: { address: string; lat: number; lng: number }) => void;
    defaultCenter?: { lat: number; lng: number };
    initialLocation?: { lat: number; lng: number; address: string };
}

// Leaflet Default Icon Fix
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
});

// Current Location Icon (Blue)
const currentLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
});

function LocationMarker({
    onSelectLocation,
    currentLocation
}: {
    onSelectLocation: MapPickerProps["onSelectLocation"];
    currentLocation: { lat: number; lng: number } | null;
}) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    useMapEvents({
        click: async (e) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            setPosition({ lat, lng });

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                const address = data.display_name || "Unknown location";
                onSelectLocation({ address, lat, lng });
            } catch {
                onSelectLocation({ address: "Unknown location", lat, lng });
            }
        },
    });

    return (
        <>
            {currentLocation && (
                <Marker
                    position={currentLocation}
                    icon={currentLocationIcon}
                    title="Your current location"
                />
            )}
            {position && <Marker position={position} icon={defaultIcon} />}
        </>
    );
}

export default function MapPicker({ onSelectLocation, defaultCenter, initialLocation }: MapPickerProps) {
    const mapRef = useRef<L.Map>(null);
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (initialLocation) {
            setCurrentLocation({ lat: initialLocation.lat, lng: initialLocation.lng });
            const map = mapRef.current;
            if (map) map.setView([initialLocation.lat, initialLocation.lng], 13);
        }
    }, [initialLocation]);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setCurrentLocation({ lat, lng });

                const map = mapRef.current;
                if (map) {
                    map.setView([lat, lng], 13);
                }

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                    );
                    const data = await response.json();
                    const address = data.display_name || "Current location";
                    onSelectLocation({ address, lat, lng });
                } catch {
                    onSelectLocation({ address: "Current location", lat, lng });
                }

                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setError("Unable to get your current location. Please check location permissions.");
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    const handleSearch = async () => {
        if (!searchText.trim()) {
            setError("Please enter a location to search");
            return;
        }

        setIsSearching(true);
        setError("");

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
            );
            const results = await response.json();

            if (results.length > 0) {
                const { lat, lon, display_name } = results[0];
                const map = mapRef.current;
                if (map) map.setView([lat, lon], 13);
                onSelectLocation({
                    address: display_name,
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                });
                setError("");
            } else {
                setError("Location not found. Please try a different search.");
            }
        } catch (error) {
            console.error("Location search failed:", error);
            setError("Search failed. Please check your connection and try again.");
        } finally {
            setIsSearching(false);
        }
    };

    // Handle Enter key in search input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full space-y-3">
            {/* Search and Location in one line */}
            <div className="flex items-center gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setError("");
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Search location..."
                        className="w-full p-2.5 text-sm rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        disabled={isSearching}
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                            <Loader2 className="animate-spin w-4 h-4" />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 justify-center"
                >
                    {isSearching ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Finding</span>
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4" />
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="px-3 py-2.5 text-sm bg-secondary text-secondary-foreground border border-input rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[40px]"
                    title="Use current location"
                >
                    {isLocating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <MapPin className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-2 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-md font-medium">
                    {error}
                </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-muted-foreground text-center">
                Click anywhere on the map to select a location
                {currentLocation && " • Blue marker shows your current location"}
            </div>

            {/* Map Container */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                <MapContainer
                    center={defaultCenter || { lat: 20.5937, lng: 78.9629 }}
                    zoom={5}
                    style={{ height: "300px", width: "100%" }}
                    ref={mapRef}
                    className="z-0" // Ensure map stays below dropdowns if they overlap
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        onSelectLocation={onSelectLocation}
                        currentLocation={currentLocation}
                    />
                </MapContainer>
            </div>

            <div className="text-[10px] text-muted-foreground/60 text-center">
                💡 Tip: Use Ctrl + Scroll to zoom, click and drag to pan
            </div>
        </div>
    );
}
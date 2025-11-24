import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface MapPickerProps {
    onSelectLocation: (data: { address: string; lat: number; lng: number }) => void;
    defaultCenter?: { lat: number; lng: number };
    initialLocation?: { lat: number; lng: number; address: string };
}

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const currentLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
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
                        className="w-full p-2 text-sm rounded-md bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isSearching}
                    />
                    {isSearching && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors flex items-center gap-1 min-w-[80px] justify-center"
                >
                    {isSearching ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                            <span className="text-xs">Searching</span>
                        </>
                    ) : (
                        "Search"
                    )}
                </button>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="px-3 py-3 text-sm bg-gray-700 text-white rounded-md hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors flex items-center gap-1 min-w-4 justify-center"
                    title="Use current location"
                >
                    {isLocating ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-2 text-xs bg-red-900/50 border border-red-700 rounded-md text-red-200">
                    {error}
                </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-neutral-400 text-center">
                Click anywhere on the map to select a location
                {currentLocation && " • Blue marker shows your current location"}
            </div>

            {/* Map Container */}
            <div className="rounded-lg overflow-hidden border border-neutral-600">
                <MapContainer
                    center={defaultCenter || { lat: 20.5937, lng: 78.9629 }}
                    zoom={5}
                    style={{ height: "300px", width: "100%" }}
                    ref={mapRef}
                    className="rounded-lg"
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

            <div className="text-xs text-neutral-500 text-center">
                💡 Tip: Use Ctrl + Scroll to zoom, click and drag to pan
            </div>
        </div>
    );
}
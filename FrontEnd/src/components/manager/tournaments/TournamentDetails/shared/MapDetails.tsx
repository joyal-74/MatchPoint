import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

interface MapDetailsProps {
    label: string;
    location: string;
    longitude: number;
    latitude: number;
    icon?: React.ReactNode;
}

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapDetails({
    label,
    location,
    latitude,
    longitude,
    icon,
}: MapDetailsProps) {
    return (
        <div className="py-2 border-b border-neutral-700/30 text-sm space-y-3">

            <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                    {icon} {label}
                </span>
            </div>

            {/* Read-only Map */}
            <div className="rounded-lg overflow-hidden border border-neutral-700 h-[200px]">
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[latitude, longitude]} icon={defaultIcon} />
                </MapContainer>
            </div>

            {location && (
                <p className="text-sm text-yellow-400 break-words">{location}</p>
            )}
        </div>
    );
}

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Trophy, ExternalLink } from 'lucide-react';
import type { Tournament } from '../../../../features/manager/managerTypes'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface OverviewTabProps {
    tournament: Tournament;
}

const OverviewTab = ({ tournament }: OverviewTabProps) => {
    const mapLat = tournament.latitude || 9.9312; 
    const mapLng = tournament.longitude || 76.2673;

    return (
        <div className="space-y-10 animate-in fade-in duration-300">
            <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-foreground mb-3">About the Event</h3>
                <p className="text-muted-foreground leading-7">{tournament.description || "Join us for an electrifying tournament experience."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-card border border-border group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase">Prize Pool</span>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">₹{tournament.prizePool.toLocaleString()}</div>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase">Entry Fee</span>
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">₹</div>
                    </div>
                    <div className="text-2xl font-bold">₹{tournament.entryFee}</div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" /> Venue Location
                    </h3>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLng}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs flex items-center gap-1 text-primary hover:underline"
                    >
                        Open in Maps <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-border shadow-sm z-0 relative">
                    <MapContainer
                        center={[mapLat, mapLng]}
                        zoom={14}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='© <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[mapLat, mapLng]}>
                            <Popup className="text-foreground">
                                <span className="font-semibold">{tournament.title}</span><br />
                                {tournament.location}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
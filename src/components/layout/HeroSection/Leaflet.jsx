"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const position = [23.7892289, 90.4197542];

export default function LeafletMap() {
  return (
    <div className="w-full h-[150px] md:h-[150px] rounded-xl overflow-hidden mt-2 relative z-0">
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Tooltip
            direction="right"
            offset={[10, 0]}
            opacity={1}
            permanent
            className="bg-transparent! border-none! shadow-none! [&::before]:hidden"
          >
            <div className="font-bold text-gray-800 leading-tight">
              FINTRA.
              <br />
              Securities Limited
            </div>
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}

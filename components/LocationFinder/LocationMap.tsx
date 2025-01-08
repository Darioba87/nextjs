import type { CimdataLocation, LatLng } from '@/types/location-types';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

type Props = {
  zoom: number;
  center: LatLng;
  locations?: CimdataLocation[];
};
export default function LocationMap({ zoom, center, locations }: Props) {
  /* Achtung: Die zoom und center-Props von MapContainer werden nur für die
	erste Darstellung der Karte verwendet, wenn sie sich später ändern, 
	hat das keine Auswirkung auf die Karte! */
  return (
    <MapContainer zoom={zoom} center={center} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations?.map(({ title, latLng }) => (
        <Marker key={title} position={latLng}>
          <Popup>
            <strong>{title}</strong>
          </Popup>
        </Marker>
      ))}
      <MapController center={center} zoom={zoom} />
    </MapContainer>
  );
}

/* 
1. zoom und center als Props an MapController übergeben
2. zoom und center mit useEffect beobachten und im Effekt
die Methode setView auf map anwenden.
(https://leafletjs.com/reference.html#map-methods-for-modifying-map-state)
*/
type MapControllerProps = Pick<Props, 'center' | 'zoom'>;
function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

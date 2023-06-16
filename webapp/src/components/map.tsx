import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { findAllUserPoints } from "../logic/podManager";
import { PointMarker } from "../customtypes";
import { useState } from 'react';
import { useSession } from "@inrupt/solid-ui-react";

function Map(): JSX.Element {

  const { session } = useSession();
  const position: LatLngExpression = [50.85119149087381, 4.3544687591272835];
  const [points, setPoints] = useState<PointMarker[]>([]);

  const loadPoints = async () => {
    const data: PointMarker[] = await findAllUserPoints(session.info.webId as string);
    
    setPoints(data);
  };
  loadPoints();

  return (
    <>
      <MapContainer id="mapContainer" center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point: PointMarker) => {
              return (
                <Marker
                  key={point.id}
                  position={[
                    point.lat,
                    point.lon
                  ]}
                >
                  <Popup>
                    {point.name}
                  </Popup>
                </Marker>
              );
            })}
      </MapContainer>
    </>
  );
}

export default Map;
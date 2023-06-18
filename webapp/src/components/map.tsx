import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { findAllUserPoints } from "../logic/podManager";
import { PointMarker } from "../customtypes";
import { useEffect, useState } from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import PointMarkerImage from "./pointMarkerImage";

function Map(): JSX.Element {

  const { session } = useSession();
  const position: LatLngExpression = [50.85119149087381, 4.3544687591272835];
  const [points, setPoints] = useState<PointMarker[]>([]);
  const [allPoints, setAllPoints] = useState<PointMarker[]>([]);
  const [cat, setCat] = useState<string>('Sin categoría');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const loadPoints = async () => {
      const data: PointMarker[] = await findAllUserPoints(session.info.webId as string);
      setAllPoints(data);
      setPoints(data);
    };
    loadPoints();
  }, [session.info.webId]);
  const filter = async () => {
    if (cat === "Sin filtro")
      setPoints(allPoints);
    else {
      let result: PointMarker[] = [];
      allPoints.forEach(pointMarker => {
        if (pointMarker.cat === cat)
          result.push(pointMarker);
      });
      setPoints(result);
    }
  }
  return (
    <>
      <select
        onChange={(e) => {
          setSelectedOption(e.currentTarget.value);
          setCat(e.target.value);
        }}
        value={selectedOption}
      >
        <option value='Sin categoría' >Sin categoría</option>
        <option value="Restaurante" >Restaurante</option>
        <option value='Bar' >Bar</option>
        <option value='Tienda' >Tienda</option>
        <option value='Paisaje' >Paisaje</option>
        <option value='Monumento' >Monumento</option>
        <option value='Sin filtro' >Sin filtro</option>

      </select>
      <button onClick={(e) => { e.preventDefault(); filter(); }}>Filtrar</button>
      
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
                {point.name}<br></br>
                Categoría: {point.cat}<br></br>
                Puntuación: {point.score}<br></br>
                Comentario: {point.comment}<br></br>
                <PointMarkerImage imageName={point.image}></PointMarkerImage>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}

export default Map;
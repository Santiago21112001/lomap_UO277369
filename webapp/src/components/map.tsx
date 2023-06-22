import { LatLngExpression, icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { findAllUserPoints } from "../logic/podManager";
import { PointMarker } from "../customtypes";
import { useEffect, useState } from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import PointMarkerImage from "./pointMarkerImage";
import { findAllSharedPointsByFriends } from "../logic/friendsPodManager";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import pointMarkerIcon from "../pointMarker.svg"

function Map(): JSX.Element {

  const { session } = useSession();
  const position: LatLngExpression = [50.85119149087381, 4.3544687591272835];
  const [points, setPoints] = useState<PointMarker[]>([]);
  const [allPoints, setAllPoints] = useState<PointMarker[]>([]);
  const [cat, setCat] = useState<string>('Sin filtro');
  const [selectedOptionFriend, setSelectedOptionFriend] = useState<number>(1);

  useEffect(() => {
    const loadPoints = async () => {
      let data: PointMarker[] = await findAllUserPoints(session.info.webId as string);
      data = data.concat(await findAllSharedPointsByFriends(session));
      setAllPoints(data);
      setPoints(data);
    };
    loadPoints();
  }, [session]);
  async function filter() {
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

  async function filterByOwner() {
    if (selectedOptionFriend === 1) {
      setPoints(allPoints);
    } else if (selectedOptionFriend === 2) {
      let result: PointMarker[] = [];
      allPoints.forEach(pointMarker => {
        if (pointMarker.yours)
          result.push(pointMarker);
      });
      setPoints(result);
    } else if (selectedOptionFriend === 3) {
      let result: PointMarker[] = [];
      allPoints.forEach(pointMarker => {
        if (!pointMarker.yours)
          result.push(pointMarker);
      });
      setPoints(result);
    }
  }

  return (
    <>

      <InputLabel id="select-filter-category-label">Filtrar en base a categoría</InputLabel>
      <Select
        labelId="select-filter-category-label"
        value={cat}
        onChange={(e) => {
          setCat(e.target.value);
        }}
      >
        <MenuItem value='Sin filtro' >Sin filtro</MenuItem>      
        <MenuItem value="Restaurante" >Restaurante</MenuItem>
        <MenuItem value='Bar' >Bar</MenuItem>
        <MenuItem value='Tienda' >Tienda</MenuItem>
        <MenuItem value='Paisaje' >Paisaje</MenuItem>
        <MenuItem value='Monumento' >Monumento</MenuItem>
        <MenuItem value='Sin categoría' >Sin categoría</MenuItem>
      </Select>
      <Button onClick={(e) => { e.preventDefault(); filter(); }} variant='contained' color='primary'>Filtrar</Button>
      <InputLabel id="label">Filtrar en base a propietario</InputLabel>
      <Select
        labelId="label"
        value={selectedOptionFriend}
        onChange={(e) => {
          setSelectedOptionFriend(Number(e.target.value));
        }}
      >
        <MenuItem value={1} >Tus puntos y los de tus amigos</MenuItem>
        <MenuItem value={2} >Sólo tus puntos</MenuItem>
        <MenuItem value={3} >Sólo los de tus amigos</MenuItem>
      </Select>
      <Button onClick={(e) => { e.preventDefault(); filterByOwner(); }} variant='contained' color='primary'>Filtrar</Button>

      <MapContainer id="mapContainer" center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point: PointMarker) => {
          return (
            <Marker
              icon={icon({
                iconUrl: pointMarkerIcon,
                iconSize: [50, 50],
                iconAnchor: [50, 50],
              })}
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
                {!point.yours ? 'Punto de tu amigo ' + point.friend?.name : ''}<br></br>
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
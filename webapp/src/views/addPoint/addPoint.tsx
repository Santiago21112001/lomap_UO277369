import { useSession } from "@inrupt/solid-ui-react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addUserPoint } from "../../logic/podManager";
import { PointMarker } from "../../customtypes";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerToMove from "../../components/markerToMove";
import CategoryOptions from "../../components/categorysOptions";
import PointMarkerImage from "../../components/pointMarkerImage";

function AddPointForm(): JSX.Element {

    const { session } = useSession();
    const [nameP, setName] = useState<string>('Mi nuevo punto');
    const [latP, setLat] = useState<number>(50.85119149087381);
    const [lonP, setLon] = useState<number>(4.3544687591272835);
    const [cat, setCat] = useState<string>('Sin categoría');
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [image, setImage] = useState<string>("Sin imagen");
    const [msg, setMsg] = useState<string>('');


    const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImage((event.target as HTMLInputElement).value);
    };

    async function addPoint(lat: number, lon: number): Promise<void> {
        let uuid: string = uuidv4();
        let p: PointMarker = { id: uuid, name: nameP, lat, lon, cat, score, comment,image }
        await addUserPoint(p, session.info.webId as string, session.fetch);
    }

    async function handleSubmit(e: React.MouseEvent): Promise<void> {
        e.preventDefault();
        if (nameP.trimEnd().length === 0) {
            setMsg("Nombre vacío");
        } else {
            await addPoint(latP, lonP);
            window.location.href = "/";
        }

    }

    const callback = async (lat: number, lon: number) => {
        setLat(lat);
        setLon(lon);

    }

    return (
        <>
            <FormControl>
                <>{msg}</>
                <TextField
                    required
                    label="Name"
                    value={nameP}
                    onChange={e => setName(e.target.value)}
                />
                <div>{latP}</div>
                <div>{lonP}</div>
                <select
                    onChange={(e) => {
                        setSelectedOption(e.currentTarget.value);
                        setCat(e.target.value);
                    }}
                    value={selectedOption}
                >
                    <CategoryOptions></CategoryOptions>
                </select>
                <input type="number" value={score} onChange={(e) => { setScore(Number(e.target.value)) }}></input>
                <TextField
                    label="Comentario"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <FormLabel id="demo-radio-buttons-group-label">Escoge una imagen para tu punto</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Sin imagen"
                    name="radio-buttons-group"
                    value={image}
                    onChange={handleRadioButtonChange}
                >
                    <FormControlLabel value="Sin imagen" control={<Radio />} label="Sin imagen" />
                    <FormControlLabel value="edificio" control={<Radio />} label="Edificio" />
                    <PointMarkerImage imageName="edificio"></PointMarkerImage>
                    <FormControlLabel value="paisaje" control={<Radio />} label="Paisaje" />
                    <PointMarkerImage imageName="paisaje"></PointMarkerImage>
                </RadioGroup>
            </FormControl>
            <button onClick={(e) => { e.preventDefault(); handleSubmit(e); }}>Agregar punto</button>
            <MapContainer id="mapContainer" center={[
                latP,
                lonP
            ]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerToMove callback={callback}></MarkerToMove>

            </MapContainer>
        </>
    );
}

export default AddPointForm;
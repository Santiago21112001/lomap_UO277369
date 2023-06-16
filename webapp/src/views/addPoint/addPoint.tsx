import { useSession } from "@inrupt/solid-ui-react";
import { TextField } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addUserPoint } from "../../logic/podManager";
import { PointMarker } from "../../customtypes";
import { MapContainer, TileLayer } from "react-leaflet";
import DraggableMarker from "../../components/DraggableMarker";

function AddPointForm(): JSX.Element {

    const { session } = useSession();
    const [nameP, setName] = useState<string>('Mi nuevo punto');
    const [latP, setLat] = useState<number>(50.85119149087381);
    const [lonP, setLon] = useState<number>(4.3544687591272835);
    const [msg, setMsg] = useState<string>('');

    async function addPoint(lat:number,lon:number): Promise<void> {
        let uuid: string = uuidv4();
        let p: PointMarker = { id: uuid, name: nameP, lat, lon }
        await addUserPoint(p, session.info.webId as string, session.fetch);
    }

    async function handleSubmit(e: React.MouseEvent): Promise<void> {
        e.preventDefault();
        if (nameP.trimEnd().length === 0) {
            setMsg("Nombre vacío");
        } else {
            await addPoint(latP,lonP);
            window.location.href = "/";
        }

    }

    const callback = (lat:number,lon:number) => {
        setLat(lat);
        setLon(lon);
    }

    return (
        <>
            <>{msg}</>
            <TextField
                required
                label="Name"
                value={nameP}
                onChange={e => setName(e.target.value)}
            />
            <TextField
                required
                label="lat"
                value={latP}

            />
            <TextField
                required
                label="lon"
                value={lonP}

            />
            
            <MapContainer id="mapContainer" center={[
                        latP,
                        lonP
                    ]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <DraggableMarker lat={latP} lon={lonP} callback={callback}></DraggableMarker>

            </MapContainer>
            <button onClick={(e) => { handleSubmit(e); }}>Accept</button>
        </>
    );
}

export default AddPointForm;
import { useSession } from "@inrupt/solid-ui-react";
import { Box, Button, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addUserPoint } from "../../logic/podManager";
import { Friend, PointMarker } from "../../customtypes";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerToMove from "../../components/markerToMove";
import PointMarkerImage from "../../components/pointMarkerImage";
import { addSharedPointForFriend, getAllFriends } from "../../logic/friendsPodManager";
import { Link } from "react-router-dom";

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
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendsToShare, setFriendsToShare] = useState<Friend[]>([]);

    useEffect(() => {
        async function loadFriends() {
            setFriends(await getAllFriends(session.info.webId as string));
        }
        loadFriends();
    }, [session.info.webId])

    const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImage((event.target as HTMLInputElement).value);
    };

    async function addPoint(p: PointMarker): Promise<void> {
        await addUserPoint(p, session.info.webId as string, session.fetch);
    }

    async function handleSubmit(e: React.MouseEvent): Promise<void> {
        e.preventDefault();
        if (nameP.trimEnd().length === 0) {
            setMsg("Nombre vacío");
        } else {
            let uuid: string = uuidv4();
            if(score<0) {
                setScore(0);
            }
            if(score>10) {
                setScore(10);
            }
            let p: PointMarker = { id: uuid, name: nameP, lat: latP, lon: lonP, cat, score, comment, image, yours: true, sharedWith: friendsToShare }
            await addPoint(p);
            p.sharedWith = [];
            friendsToShare.forEach(async (friendWebIdToShare) => {
                await addSharedPointForFriend(p, session.fetch, friendWebIdToShare);
            });
            setMsg("Punto agregado");
        }

    }
    async function handleCheckBoxChange(e: React.ChangeEvent<HTMLInputElement>, friend: Friend): Promise<void> {
        if (e.target.checked) {
            addFriendToShare(friend);
        } else {
            removeFriendToShare(friend);
        }
    }

    function addFriendToShare(friendToAdd: Friend) {
        if (!checkFriendToShareNotOnList(friendToAdd)) {
            setFriendsToShare([...friendsToShare, friendToAdd]);
        }
    }
    function removeFriendToShare(friendToRemove: Friend) {
        setFriendsToShare(friendsToShare.filter((friendToShare) => friendToShare.webId !== friendToRemove.webId));
    }
    function checkFriendToShareNotOnList(friendToCheck: Friend) {
        return friendsToShare.some((friendWebIdToShare) => friendWebIdToShare.webId === friendToCheck.webId);
    }

    const callback = async (lat: number, lon: number) => {
        setLat(lat);
        setLon(lon);

    }

    return (
        <>
            <nav>
                <Link to="/">Volver al mapa de puntos</Link>
            </nav>
            <Box component="h1">Añadir punto</Box>
            <Box component="h2">Introduce los datos y luego arrastra el marcador del mapa para elegir la posición de tu nuevo punto</Box>
                <TextField
                    required
                    label="Name"
                    value={nameP}
                    onChange={e => setName(e.target.value)}
                />
                <Box component="div">Latitud: {latP}</Box>
                <Box component="div">Longitud: {lonP}</Box>
                <FormControl>
                <InputLabel id="select-filter-category-label">Filtrar en base a categoría</InputLabel>
                <Select
                    labelId="select-filter-category-label"
                    label="Filtrar en base a categoría"
                    value={cat}
                    onChange={(e) => {
                        setCat(e.target.value);
                    }}
                >
                    <MenuItem value='Sin categoría' >Sin categoría</MenuItem>
                    <MenuItem value="Restaurante" >Restaurante</MenuItem>
                    <MenuItem value='Bar' >Bar</MenuItem>
                    <MenuItem value='Tienda' >Tienda</MenuItem>
                    <MenuItem value='Paisaje' >Paisaje</MenuItem>
                    <MenuItem value='Monumento' >Monumento</MenuItem>
                </Select>
                <FormLabel id="score-label">Proporciona una valoración al punto entre 0 y 10</FormLabel>
                <input max={10} min={0} type="number" value={score} onChange={(e) => { setScore(Number(e.target.value)) }}></input>
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
            <p>Amigos con los que compartir tu punto</p>

            <FormGroup>
                {friends.map(friend => {
                    return (<><label key={uuidv4()} htmlFor="checkbox">{friend.name}</label>
                        <input key={uuidv4()}
                            type="checkbox"
                            onChange={(e) => { handleCheckBoxChange(e, friend) }}
                            id="checkbox"
                        /></>);

                })}
            </FormGroup>
            <Button onClick={(e) => { handleSubmit(e); }} variant='contained' color='primary'>Agregar punto</Button>
            <>{msg}</>
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
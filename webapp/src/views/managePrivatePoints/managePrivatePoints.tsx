import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { findAllUserPoints } from "../../logic/podManager";
import { Friend, PointMarker } from "../../customtypes";
import { addSharedPointForFriend, getAllFriends } from "../../logic/friendsPodManager";
import { Link } from "react-router-dom";
import { Box, Button, FormGroup } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import AlertMessage from "../../components/alertMessage/alertMessage";

function ManagePrivatePoints(): JSX.Element {

    const { session } = useSession();
    const [msg, setMsg] = useState<string>('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [points, setPoints] = useState<PointMarker[]>([]);
    const [friendsToShare, setFriendsToShare] = useState<Friend[]>([]);

    useEffect(() => {
        async function loadFriendsAndPoints() {
            let friends: Friend[] = await getAllFriends(session.info.webId as string);
            setFriends(friends);
            let points: PointMarker[] = await findAllUserPoints(session.info.webId as string);
            let privatePoints: PointMarker[] = [];
            points.forEach(point => {
                if (point.sharedWith.length === 0) {
                    privatePoints.push(point);
                }
            })
            setPoints(privatePoints);
        }
        loadFriendsAndPoints();
    }, [session.info.webId])

    async function sharePointWithFriend(point: PointMarker, friend: Friend): Promise<void> {
        if (point.sharedWith.includes(friend))
            return;
        await addSharedPointForFriend(point, session.fetch, friend);
    }

    async function sharePointWithFriends(point: PointMarker): Promise<void> {
        friendsToShare.forEach(async (friendWebIdToShare) => {
            await sharePointWithFriend(point, friendWebIdToShare);
        });
        setMsg("puntos compartidos")
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
    return (
        <>
            <nav>
                <Link to="/">Volver al mapa de puntos</Link>
            </nav>
            <Box component="h1">Compartir tus puntos con amigos</Box>
            <Box component="h2">Selecciona los amigos marcando su checkbox y luego dale al botón 'Compartir' del punto que quieras compartir</Box>

            {friends.map(friend => {
                return (<><label key={uuidv4()} htmlFor="checkbox">Amigo {friend.name}</label>
                    <input key={uuidv4()}
                        type="checkbox"
                        onChange={(e) => { handleCheckBoxChange(e, friend) }}
                        id="checkbox"
                    /></>);

            })}
            <ul>
                {points.map(point => {
                    return (<>{point.name}
                        <Button key={uuidv4()} onClick={() => sharePointWithFriends(point)} variant='contained' color='primary'>Compartir</Button>
                    </>)
                })}
            </ul>
            <AlertMessage msg={msg} />
        </>
    );
}

export default ManagePrivatePoints;
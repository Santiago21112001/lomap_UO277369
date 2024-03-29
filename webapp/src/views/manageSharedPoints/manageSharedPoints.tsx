import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { Friend } from "../../customtypes";
import { removeSharedPointsForFriend, getAllFriends } from "../../logic/friendsPodManager";
import { Link } from "react-router-dom";
import { Box, Button, FormGroup } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import AlertMessage from "../../components/alertMessage/alertMessage";

function ManageSharedPoints(): JSX.Element {

    const { session } = useSession();
    const [msg, setMsg] = useState<string>('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendsToUnshare, setFriendsToUnshare] = useState<Friend[]>([]);

    useEffect(() => {
        async function loadFriends() {
            let friends: Friend[] = await getAllFriends(session.info.webId as string);
            setFriends(friends);
        }
        loadFriends();
    }, [session.info.webId])


    async function unsharePointsWithFriend(friend: Friend): Promise<void> {
        await removeSharedPointsForFriend(session.fetch, friend);
    }

    async function unsharePointsWithFriends(): Promise<void> {
        friendsToUnshare.forEach(async (friendWebIdToShare) => {
            await unsharePointsWithFriend(friendWebIdToShare);
        });
        setMsg("puntos descompartidos")
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
            setFriendsToUnshare([...friendsToUnshare, friendToAdd]);
        }
    }
    function removeFriendToShare(friendToRemove: Friend) {
        setFriendsToUnshare(friendsToUnshare.filter((friendToShare) => friendToShare.webId !== friendToRemove.webId));
    }
    function checkFriendToShareNotOnList(friendToCheck: Friend) {
        return friendsToUnshare.some((friendWebIdToShare) => friendWebIdToShare.webId === friendToCheck.webId);
    }

    return (
        <>
            <nav>
                <Link to="/">Volver al mapa de puntos</Link>
            </nav>
            <Box component="h1">Dejar de compartir tus puntos con amigos</Box>
            <Box component="h2">Selecciona los amigos marcando su checkbox y luego dale al botón 'Dejar de compartir' para dejar de compartir todos tus puntos con esos amigos</Box>
            {friends.map(friend => {
                return (<><label key={uuidv4()} htmlFor="checkbox">{friend.name}</label>
                    <input key={uuidv4()}
                        type="checkbox"
                        onChange={(e) => { handleCheckBoxChange(e, friend) }}
                        id="checkbox"
                    /></>);

            })}
            <br></br>
            <Button key={uuidv4()} onClick={() => unsharePointsWithFriends()} variant='contained' color='primary'>Dejar de compartir</Button>
            <AlertMessage msg={msg} />

        </>
    );
}

export default ManageSharedPoints;

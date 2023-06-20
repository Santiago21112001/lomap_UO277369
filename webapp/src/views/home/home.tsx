import { useSession } from "@inrupt/solid-ui-react";
import { Container, Box, Button, List, ListItemText } from "@mui/material";
import { getPODUserProfileInfo, getUserScoreFromPOD, logoutFromPOD } from "../../logic/podManager";
import { useEffect, useState } from "react";
import { Friend, User, UserScore } from "../../customtypes";
import Map from "../../components/map";
import { Link } from "react-router-dom";
import { getAllFriends } from "../../logic/friendsPodManager";

function Home(): JSX.Element {

  const { session } = useSession();
  const [name, setName] = useState<string>("");
  const [myId, setMyId] = useState<string>("");
  const [score, setScore] = useState<UserScore>({ addedPointMarkersScore: 0, sharedPointMarkersScore: 0 });
  const [friends, setFriends] = useState<Friend[]>([]);

  async function logout() {
    await logoutFromPOD(session);
  }

  useEffect(() => {
    async function loadUserInfoFromPOD() {
      const userInSession: User = await getPODUserProfileInfo(session.info.webId as string);
      setName(userInSession.name);
      setMyId(userInSession.webId);
      let score: UserScore = await getUserScoreFromPOD(session.info.webId as string);
      setScore(score);
      let friends: Friend[] = await getAllFriends(session.info.webId as string);
      setFriends(friends);
    };
    loadUserInfoFromPOD();
  }, [session.info.webId])

  return (
    <Container maxWidth="sm" >
      <nav>
        <Link color="primary" to="addPoint">Agregar punto</Link><br></br>
        <Link to="addFriend">Agregar amigo</Link><br></br>
        <Link to="sharePoints">Compartir tus puntos con amigos</Link><br></br>
        <Link to="unsharePoints">Dejar de compartir tus puntos con amigos</Link><br></br>
      </nav>
      <Button onClick={logout} variant='contained' color='secondary'>Salir de sesión</Button>
      <Box component="h1" sx={{ py: 2,backgroundColor: "black",color:"white" }}>
        Mapa personalizado
      </Box>
      
      <List
        sx={{ width: '100%',py:1,backgroundColor: "primary.dark",color:"white" }}
      >
        <ListItemText primary={"Tu nombre: " + name} />
        <ListItemText primary={"Tu ID: " + myId} />
        <ListItemText primary={"Puntuación por añadir puntos: " + score.addedPointMarkersScore} />
        <ListItemText primary={"Puntuación por compartir puntos: " + score.sharedPointMarkersScore} />
        <ListItemText color="" primary="Tus amigos: " />
        <List>
          {friends.map(friend => {
            return (<ListItemText key={friend.webId} primary={friend.webId} />)
          })}
        </List>
      </List>
      <Map />
    </Container>
  );
}

export default Home;
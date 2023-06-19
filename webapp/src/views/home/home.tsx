import { LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { Container, Box } from "@mui/material";
import { getPODUserProfileInfo, getUserScoreFromPOD } from "../../logic/podManager";
import { useEffect, useState } from "react";
import { Friend, UserInSession, UserScore } from "../../customtypes";
import Map from "../../components/map";
import { Link } from "react-router-dom";
import { getAllFriends } from "../../logic/friendsPodManager";

function Home(): JSX.Element {

  const { session } = useSession();
  const [name, setName] = useState<string>("");
  const [score,setScore]=useState<UserScore>({addedPointMarkersScore:0,sharedPointMarkersScore:0});
  const[friends,setFriends]=useState<Friend[]>([]);

  useEffect(() => {
    async function loadUserInfoFromPOD() {
      const userInSession: UserInSession = await getPODUserProfileInfo(session.info.webId as string);
      setName(userInSession.name ?? session.info.webId?.split("/")[2]);
      let score:UserScore = await getUserScoreFromPOD(session.info.webId as string);
      setScore(score);
      let friends:Friend[] = await getAllFriends(session.info.webId as string);
      setFriends(friends);
    };
    loadUserInfoFromPOD();
  }, [session.info.webId])

  return (
    <Container maxWidth="sm" >
      <nav>
        <Link to="addPoint">Agregar punto</Link>
        <Link to="addFriend">Agregar amigo</Link>
      </nav>
      <Box component="h1" sx={{ py: 2 }}>
        Mapa.
      </Box>
      <p>{name}</p>
      <p>Puntuación por añadir puntos: {score.addedPointMarkersScore}</p>
      <p>Puntuación por compartir puntos: {score.sharedPointMarkersScore}</p>
      <p>Mis amigos:</p>
      <ul>
      {friends.map(friend => {
        return (<li key={friend.webId}>{friend.webId}</li>)
        
      })}
      </ul>
      <Map></Map>
      <LogoutButton />
    </Container>
  );
}

export default Home;
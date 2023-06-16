import { LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { Container, Box } from "@mui/material";
import { getPODUserProfileInfo } from "../../logic/podManager";
import { useState } from "react";
import { UserInSession } from "../../customtypes";
import Map from "../../components/map";
import { Link } from "react-router-dom";

function Home(): JSX.Element {

  const { session } = useSession();
  const [name, setName] = useState<string>("");

  
  async function loadUserInfoFromPOD() {
    const userInSession: UserInSession = await getPODUserProfileInfo(session.info.webId as string);
    setName(userInSession.name ?? session.info.webId?.split("/")[2]);
  };
  loadUserInfoFromPOD();
  

  return (
    <Container maxWidth="sm" >
      <nav>
        <Link to="addPoint">Agregar punto</Link>
      </nav>
      <Box component="h1" sx={{ py: 2 }}>
        Mapa.
      </Box>
      <p>{name}</p>
      <Map></Map>
      <LogoutButton />
    </Container>
  );
}

export default Home;
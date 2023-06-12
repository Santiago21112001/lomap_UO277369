import { LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { Container, Box } from "@mui/material";
import { getPODUserProfileInfo } from "../../logic/podManager";
import { useState } from "react";
import { UserInSession } from "../../customtypes";

function Home(): JSX.Element {

  const { session } = useSession();
  const [name, setName] = useState<string>("");

  async function loadUserInfoFromPOD() {
    const userInSession: UserInSession = await getPODUserProfileInfo(session.info.webId as string);
    setName(userInSession.name ?? session.info.webId?.split("/")[2]);
  };
  loadUserInfoFromPOD();

  return (
    <Container maxWidth="sm">
      <Box component="h1" sx={{ py: 2 }}>
        Mapa.
      </Box>
      <p>{name}</p>
      <LogoutButton />
    </Container>
  );
}

export default Home;
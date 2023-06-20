import { Container, Box } from "@mui/material";
import PODForm from "../../components/PODForm";

function Login(): JSX.Element {
  return (
    <>
      <Container maxWidth="sm">
        <Box component="h1" sx={{ py: 2 }}>Iniciar sesión.</Box>
        <PODForm />
      </Container>
    </>
  );
}

export default Login;
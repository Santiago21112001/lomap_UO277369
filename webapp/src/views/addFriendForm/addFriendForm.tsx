import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { addFriend } from "../../logic/friendsPodManager";
import { useSession } from "@inrupt/solid-ui-react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/alertMessage/alertMessage";

function AddFriendForm(): JSX.Element {

  const { session } = useSession();
  const [friendWebId, setFriendWebId] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  async function handleSubmit() {
    if (friendWebId.trimEnd().length === 0) {
      setMsg("ID vacío");
    } else {
      try {
        await addFriend(session.info.webId as string, friendWebId);
        setMsg("Amigo agregado");
      } catch (error) {
        setMsg("Usuario inválido. Comprueba que existe y que lo has escrito bien.");
      }
    }
  }

  return (
    <>
      <nav>
        <Link to="/">Volver al mapa de puntos</Link>
      </nav>
      <Box component="h1">Añadir amigo</Box>
      <Box component="h2">Escribe la ID de tu amigo con el siguiente formato: 'usuario'.'proveedor'</Box>
      <Box component="h3">Ejemplo de un usuario llamado 'pepito1234' con el proveedor 'inrupt.net': pepito1234.inrupt.net</Box>
      <AlertMessage msg={msg} />
      <TextField
        required
        label="ID de tu amigo"
        value={friendWebId}
        onChange={e => setFriendWebId(e.target.value)}
      />
      <Button onClick={(e) => { e.preventDefault(); handleSubmit(); }} variant='contained' color='primary'>Agregar amigo</Button>
    </>
  );
}

export default AddFriendForm;
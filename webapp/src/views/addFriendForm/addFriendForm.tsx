import { TextField } from "@mui/material";
import { useState } from "react";
import { addFriend } from "../../logic/friendsPodManager";
import { useSession } from "@inrupt/solid-ui-react";
import { Link } from "react-router-dom";

function AddFriendForm(): JSX.Element {

  const { session } = useSession();
  const [friendWebId, setFriendWebId] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  async function handleSubmit() {
    if (friendWebId.trimEnd().length === 0) {
      setMsg("ID vacío");
    } else {
      await addFriend(session.info.webId as string, friendWebId);
      setMsg("Amigo agregado")
    }
  }

  return (
    <>
      <nav>
        <Link to="/">Volver al mapa de puntos</Link>
      </nav>  
      <TextField
        required
        label="ID de tu amigo"
        value={friendWebId}
        onChange={e => setFriendWebId(e.target.value)}
      />
      <>{msg}</>
      <button onClick={(e) => { e.preventDefault(); handleSubmit(); }}>Agregar amigo</button>
    </>
  );
}

export default AddFriendForm;
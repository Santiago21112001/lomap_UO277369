import { TextField } from "@mui/material";
import { useState } from "react";
import { addFriend } from "../../logic/friendsPodManager";
import { useSession } from "@inrupt/solid-ui-react";

function AddFriendForm(): JSX.Element {

  const { session } = useSession();
  const [friendWebId, setFriendWebId] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  async function handleSubmit() {
    if (friendWebId.trimEnd().length === 0) {
      setMsg("ID vacío");
    } else {
      await addFriend(session.info.webId as string, friendWebId);
      window.location.href = "/";
    }
  }

  return (
    <>
      <>{msg}</>
      <TextField
        required
        label="ID de tu amigo"
        value={friendWebId}
        onChange={e => setFriendWebId(e.target.value)}
      />
      <button onClick={(e) => { e.preventDefault(); handleSubmit(); }}>Agregar amigo</button>
    </>
  );
}

export default AddFriendForm;
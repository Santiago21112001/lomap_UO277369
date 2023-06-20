import { useState } from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import { goToPODLoginPage } from '../logic/podManager';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function PODForm(): JSX.Element {

  const { session } = useSession();
  const [providerUrl, setProviderUrl] = useState('https://inrupt.net/');

  async function handleLogin() {
    goToPODLoginPage(session, providerUrl).then(() => {
      session.info.isLoggedIn = true;
    })
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="select-provider-label">Elige tu proveedor de POD</InputLabel>
      <Select
        labelId="select-provider-label"
        id="select-provider"
        value={providerUrl}
        label="Elige tu proveedor de POD"
        onChange={(e) => {
          setProviderUrl(e.target.value);
        }}
      >
        <MenuItem value={"https://inrupt.net/"}>https://inrupt.net</MenuItem>
        <MenuItem value={'https://solidcommunity.net/'}>https://solidcommunity.net</MenuItem>
      </Select>
      <Button onClick={handleLogin} variant='contained' color='primary'>Iniciar sesión</Button>
    </FormControl>
  );
}

export default PODForm;
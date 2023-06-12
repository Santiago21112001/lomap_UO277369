import { useState } from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import { goToPODLoginPage } from '../logic/podManager';

function PODForm(): JSX.Element {

  const { session } = useSession();
  const [providerUrl, setProviderUrl] = useState('https://inrupt.net/');
  const [selectedOption, setSelectedOption] = useState('https://inrupt.net/');

  async function handleLogin() {
    goToPODLoginPage(session, providerUrl).then(() => {
      session.info.isLoggedIn = true;
    })
  }

  return (
    <>
      <select id="select-provider"
        onChange={(e) => {
          setSelectedOption(e.currentTarget.value);
          setProviderUrl(e.target.value);
        }}
        value={selectedOption}
      >
        <option value="https://inrupt.net/" defaultValue={"https://inrupt.net/"}>https://inrupt.net/</option>
        <option value='https://solidcommunity.net/' defaultValue={'https://solidcommunity.net/'}>https://solidcommunity.net/</option>
      </select>
      <button onClick={handleLogin}>login</button>
    </>
  );
}

export default PODForm;
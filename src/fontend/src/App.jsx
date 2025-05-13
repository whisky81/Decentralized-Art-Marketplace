import { useState, useEffect } from 'react';
import getEthersProvider from './api/getEthersProvider';
import getContract from './api/getContract';
import NavBar from './components/NavBar';
import Loading from './components/Loading';
import PublicArt from './pages/PublicArt';
import ArtGallery from './pages/ArtGallery';
function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const conn = await getEthersProvider();
        const signer = await conn.getSigner();
        setAccount(await signer.getAddress());
        setContract(await getContract(signer));
        setProvider(conn);
      } catch (error) {
        alert(error.message);
      }
    }
    init();
  }, []);
  if (!provider || !contract) {
    return <Loading />;
  }

  return (
    <>
      <NavBar contract={contract}/>
      <ArtGallery contract={contract} account={account}/>
      <PublicArt contract={contract} />
    </>
  );
}

export default App

import { useState, useEffect } from 'react';
import getEthersProvider from './api/getEthersProvider';
import getContract from './api/getContract';
import NavBar from './components/NavBar';
import Loading from './components/Loading';
import PublicArt from './pages/PublicArt';
import ArtGallery from './pages/ArtGallery';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardDetail from './components/CardDetail'; 
import MyWalletInfo from './pages/MyWalletInfo';
import Transfer from './pages/Transfer';
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
      
      <BrowserRouter>
        <NavBar contract={contract} account={account}/>
        <Routes>
          <Route path="/create" element={<PublicArt contract={contract} />} />
          <Route path="/">
            <Route index element={<ArtGallery contract={contract} account={account}/>}/>
            <Route path="/nft/:tokenId" element={<CardDetail contract={contract} account={account}/>} />
          </Route>
          <Route path="/:account" element={<MyWalletInfo contract={contract} provider={provider}/>}/>
          <Route path="/transfer/:tokenId" element={<Transfer contract={contract} account={account}/>}/>
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App

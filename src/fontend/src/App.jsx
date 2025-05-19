import NavBar from './components/NavBar';
import Loading from './components/Loading';
import PublicArt from './pages/PublicArt';
import ArtGallery from './pages/ArtGallery';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardDetail from './components/CardDetail';
import MyWalletInfo from './pages/MyWalletInfo';
import Transfer from './pages/Transfer';
import Guide from './pages/Guide';
import { usePE } from './hooks/usePE';


function App() {
  const { starting, error } = usePE();
  if (starting || error) {
    return <Loading />;
  }

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/create" element={<PublicArt/>} />
          <Route path="/">
            <Route index element={<ArtGallery/>} />
            <Route path="/nft/:tokenId" element={<CardDetail/>} />
          </Route>
          <Route path="/:account" element={<MyWalletInfo/>}/>
          <Route path="/transfer/:tokenId" element={<Transfer/>} />
          <Route path="/guide" element={<Guide/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

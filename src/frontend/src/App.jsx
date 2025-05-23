import NavBar from './components/NavBar';
import Loading from './components/Loading';
import ArtGallery from './pages/ArtGallery';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardDetail from './components/CardDetail';
import MyWalletInfo from './pages/MyWalletInfo';
import Transfer from './pages/Transfer';
import { usePE } from './hooks/usePE';
import CreateNftForm from './pages/PublicArtV2';
import NotFound from './pages/NotFound';


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
          <Route path="/">
            <Route index element={<ArtGallery/>} />
            <Route path="/nft/:tokenId" element={<CardDetail/>} />
          </Route>
          <Route path="/:account" element={<MyWalletInfo/>}/>
          <Route path="/transfer/:tokenId" element={<Transfer/>} />
          <Route path="/create" element={<CreateNftForm />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

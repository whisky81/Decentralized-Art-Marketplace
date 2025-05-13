import { artGallery } from "../api/utils";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import MyCard from "../components/MyCard";
export default function ArtGallery({ contract, account }) {
    const [arts, setArts] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setArts(await artGallery(contract));
                
            } catch (error) {
                alert(error.message);
            }
        }

        fetchData();
    }, []);
    if (!arts) {
        return <Loading />;
    }
    return (
        <div>
            {
                arts.map(art => (
                    <MyCard key={art.tokenId} art={art} account={account}/>
                ))
            }

        </div>
    );
}
import { artGallery } from "../api/utils";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import MyCard from "../components/Card";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
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
        <Box display="flex" flexWrap="wrap" gap={2}>
            {arts.map(art => (
                <Link to={`/nft/${art.tokenId}`} style={{ textDecoration: 'none', color: 'inherit' }}><MyCard key={art.tokenId} art={art} account={account} /></Link>
                
            ))}
        </Box>
    );
}
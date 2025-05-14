import { artGallery, shortenAddress } from "../api/utils";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import MyCard from "../components/Card";
import { Avatar, Box, CardHeader } from "@mui/material";
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
        <Box
            minHeight="100vh"
            display="flex"
            justifyContent="center"
            alignItems="left"
            bgcolor="#f7f0eb" // matches your screenshot background
            p={2}
        >
            <Box display="flex" flexWrap="wrap" gap={2}>
                {arts.map(art => (
                    <div>
                        <Link to={`/${art.owner}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <CardHeader
                                title={account === art.owner ? "You" : shortenAddress(art.owner)}
                                avatar={
                                    <Avatar>
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiIHNoYXBlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJoc2woMTQ1IDk0JSA1NyUpIiBkPSJNMCwwSDhWOEgweiIvPjxwYXRoIGZpbGw9ImhzbCg1MSA4MSUgMzglKSIgZD0iTTEsMGgxdjFoLTF6TTYsMGgxdjFoLTF6TTIsMGgxdjFoLTF6TTUsMGgxdjFoLTF6TTAsMWgxdjFoLTF6TTcsMWgxdjFoLTF6TTEsMWgxdjFoLTF6TTYsMWgxdjFoLTF6TTIsMWgxdjFoLTF6TTUsMWgxdjFoLTF6TTMsMWgxdjFoLTF6TTQsMWgxdjFoLTF6TTEsMmgxdjFoLTF6TTYsMmgxdjFoLTF6TTIsMmgxdjFoLTF6TTUsMmgxdjFoLTF6TTAsM2gxdjFoLTF6TTcsM2gxdjFoLTF6TTEsM2gxdjFoLTF6TTYsM2gxdjFoLTF6TTIsM2gxdjFoLTF6TTUsM2gxdjFoLTF6TTAsNGgxdjFoLTF6TTcsNGgxdjFoLTF6TTIsNGgxdjFoLTF6TTUsNGgxdjFoLTF6TTMsNGgxdjFoLTF6TTQsNGgxdjFoLTF6TTEsNWgxdjFoLTF6TTYsNWgxdjFoLTF6TTIsNWgxdjFoLTF6TTUsNWgxdjFoLTF6TTMsNWgxdjFoLTF6TTQsNWgxdjFoLTF6TTAsNmgxdjFoLTF6TTcsNmgxdjFoLTF6TTIsNmgxdjFoLTF6TTUsNmgxdjFoLTF6TTAsN2gxdjFoLTF6TTcsN2gxdjFoLTF6TTIsN2gxdjFoLTF6TTUsN2gxdjFoLTF6TTMsN2gxdjFoLTF6TTQsN2gxdjFoLTF6Ii8+PHBhdGggZmlsbD0iaHNsKDI0IDkwJSA2OSUpIiBkPSJNMywyaDF2MWgtMXpNNCwyaDF2MWgtMXpNMSw0aDF2MWgtMXpNNiw0aDF2MWgtMXoiLz48L3N2Zz4=" alt="avatar" />
                                    </Avatar>
                                }
                            /></Link>
                        <Link to={`/nft/${art.tokenId}`} style={{ textDecoration: 'none', color: 'inherit' }}><MyCard key={art.tokenId} art={art} account={account} /></Link>
                    </div>
                ))}
            </Box>
        </Box>
    );
}
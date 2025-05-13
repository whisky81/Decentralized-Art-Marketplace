import Card from '@mui/material/Card';
import { Avatar, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import { ethers } from 'ethers';
import ForSale from './ForSale';
import NotForSale from './NotForSale';
export default function MyCard({ art, account }) {
    console.log(art);
    const [metadata, setMetadata] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(art.metadataURI);
                const data = await response.json();
                setMetadata(data);
                console.log(data);
            } catch (error) {
                alert(error.message);
            }
        }
        fetchData();
    }, []);
    if (!metadata) {
        return <Loading />;
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={account === art.owner ? "You" : art.owner}
                avatar={
                    <Avatar>
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiIHNoYXBlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJoc2woMTQ1IDk0JSA1NyUpIiBkPSJNMCwwSDhWOEgweiIvPjxwYXRoIGZpbGw9ImhzbCg1MSA4MSUgMzglKSIgZD0iTTEsMGgxdjFoLTF6TTYsMGgxdjFoLTF6TTIsMGgxdjFoLTF6TTUsMGgxdjFoLTF6TTAsMWgxdjFoLTF6TTcsMWgxdjFoLTF6TTEsMWgxdjFoLTF6TTYsMWgxdjFoLTF6TTIsMWgxdjFoLTF6TTUsMWgxdjFoLTF6TTMsMWgxdjFoLTF6TTQsMWgxdjFoLTF6TTEsMmgxdjFoLTF6TTYsMmgxdjFoLTF6TTIsMmgxdjFoLTF6TTUsMmgxdjFoLTF6TTAsM2gxdjFoLTF6TTcsM2gxdjFoLTF6TTEsM2gxdjFoLTF6TTYsM2gxdjFoLTF6TTIsM2gxdjFoLTF6TTUsM2gxdjFoLTF6TTAsNGgxdjFoLTF6TTcsNGgxdjFoLTF6TTIsNGgxdjFoLTF6TTUsNGgxdjFoLTF6TTMsNGgxdjFoLTF6TTQsNGgxdjFoLTF6TTEsNWgxdjFoLTF6TTYsNWgxdjFoLTF6TTIsNWgxdjFoLTF6TTUsNWgxdjFoLTF6TTMsNWgxdjFoLTF6TTQsNWgxdjFoLTF6TTAsNmgxdjFoLTF6TTcsNmgxdjFoLTF6TTIsNmgxdjFoLTF6TTUsNmgxdjFoLTF6TTAsN2gxdjFoLTF6TTcsN2gxdjFoLTF6TTIsN2gxdjFoLTF6TTUsN2gxdjFoLTF6TTMsN2gxdjFoLTF6TTQsN2gxdjFoLTF6Ii8+PHBhdGggZmlsbD0iaHNsKDI0IDkwJSA2OSUpIiBkPSJNMywyaDF2MWgtMXpNNCwyaDF2MWgtMXpNMSw0aDF2MWgtMXpNNiw0aDF2MWgtMXoiLz48L3N2Zz4=" alt="avatar" />
                    </Avatar>
                }
            />
            
                  <CardMedia
                    component="img"
                    height="194"
                    image={metadata.image}
                    alt={metadata.name}
                />
                <CardContent>
                    <h3>{metadata.name}</h3>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Price: {ethers.formatEther(art.price)} ETH
                    </Typography> 
                    {art.isAvailable ? <ForSale /> : <NotForSale />}
                </CardContent>
        </Card>
    )
}
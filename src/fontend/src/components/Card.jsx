import Card from '@mui/material/Card';
import { Avatar, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import { ethers } from 'ethers';
import ForSale from './ForSale';
import NotForSale from './NotForSale';
import { shortenAddress } from '../api/utils';
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
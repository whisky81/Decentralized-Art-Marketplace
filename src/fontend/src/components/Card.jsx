import Card from '@mui/material/Card';
import { CardContent, CardMedia, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import ForSale from './ForSale';
import NotForSale from './NotForSale';
import { getMetadata } from '../api/storage';  
import { usePE } from '../hooks/usePE'; 

export default function MyCard({ art }) {
    const { pinata } = usePE() 
    const [metadata, setMetadata] = useState();
    const getDate = (timestamp) => {
        return (new Date(timestamp)).toDateString(); 
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setMetadata(await getMetadata(pinata, art.metadataURI))
            } catch (error) {
                // alert(error.message);
                console.error(error)
            }
        }
        fetchData();
    }, [metadata]);
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
                        Price: {art.price} ETH
                    </Typography> 
                    {art.status ? <ForSale /> : <NotForSale />}
                    <small>Creation Date: {getDate(art.timestamp)}</small>
                </CardContent>
        </Card>
    )
}
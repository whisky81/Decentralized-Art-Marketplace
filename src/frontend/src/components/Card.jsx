import React, { useState, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import { CardContent, CardMedia, Typography } from "@mui/material";
import Loading from './Loading';
import ForSale from './ForSale';
import NotForSale from './NotForSale';
import { getMetadata } from '../api/storage';  
import { usePE } from '../hooks/usePE'; 

function MyCard({ art }) {
    const { pinata } = usePE(); 
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const result = await getMetadata(pinata, art.metadataURI);
                setMetadata(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMetadata();
    }, [pinata, art.metadataURI]); 

    const creationDate = useMemo(() => {
        return new Date(art.timestamp).toDateString();
    }, [art.timestamp]);

    if (!metadata) {
        return <Loading />;
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            {
  metadata.video ? ( 
    <CardMedia
      component="video"
      height="194"
      src={metadata.image} 
      alt={metadata.name}
      controls
      poster={undefined} 
    />
  ) : (
    <CardMedia
      component="img"
      height="194"
      image={metadata.image} 
      alt={metadata.name}
    />
  )
}

            <CardContent>
                <h3>{metadata.name}</h3>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Price: {art.price} ETH
                </Typography>
                {art.status ? <ForSale /> : <NotForSale />}
                <small>Creation Date: {creationDate}</small>
            </CardContent>
        </Card>
    );
}

export default React.memo(MyCard, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.art) === JSON.stringify(nextProps.art);
});

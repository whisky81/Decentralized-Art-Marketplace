import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Stack } from "@mui/system";
import ArtTrackIcon from '@mui/icons-material/ArtTrack'; 
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Navbar({ contract, account }) {
    const [info, setInfo] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInfo({
                    name: await contract.name(),
                    symbol: await contract.symbol()
                });
            } catch (error) {
                alert(error.message);
            }
        }

        fetchData();
    }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#bfb6a8", color: "black", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ArtTrackIcon />

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Decentralized Art Market ({info && info.name} - {info && info.symbol})
          </Typography>
        </Stack>
        <Box>
          <Link to="/"><Button variant="outlined" sx={{ mx: 1 }}>ART GALLERY</Button></Link>
          <Link to="/create"><Button variant="outlined" sx={{ mx: 1 }}>PUBLISH YOUR ART</Button></Link>
          <Link to={`/${account}`}><Button variant="outlined" sx={{ mx: 1 }}>MY WALLET INFO</Button></Link>
          <Link to="/guide"><Button variant="outlined" sx={{ mx: 1 }}>Guide</Button></Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

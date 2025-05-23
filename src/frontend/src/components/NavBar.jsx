import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Stack } from "@mui/system";
import ArtTrackIcon from '@mui/icons-material/ArtTrack'; 
import { useState, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { usePE } from "../hooks/usePE";

export default function Navbar() {
  const { contract, account } = usePE();
  const [info, setInfo] = useState({ name: "", symbol: "" });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [name, symbol] = await Promise.all([
          contract.name(),
          contract.symbol()
        ]);
        if (isMounted) setInfo({ name, symbol });
      } catch (error) {
        console.error(error);
      }
    };
    if (contract) fetchData();
    return () => { isMounted = false; };
  }, [contract]); // Only fetch if contract changes

  const title = useMemo(() => {
    return `Decentralized Art Market${info.name ? ` (${info.name} - ${info.symbol})` : ""}`;
  }, [info.name, info.symbol]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#bfb6a8", color: "black", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ArtTrackIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Stack>
        <Box>
          <Link to="/"><Button variant="outlined" sx={{ mx: 1 }}>ART GALLERY</Button></Link>
          <Link to="/create"><Button variant="outlined" sx={{ mx: 1 }}>PUBLISH YOUR ART</Button></Link>
          <Link to={`/${account}`}><Button variant="outlined" sx={{ mx: 1 }}>MY WALLET INFO</Button></Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

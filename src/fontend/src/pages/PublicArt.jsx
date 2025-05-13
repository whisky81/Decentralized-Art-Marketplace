import { useState } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Typography,
    InputAdornment,
    FormControl,
    Select,
    OutlinedInput,
    Button,
} from "@mui/material";
import { publicNewArtwork } from '../api/utils.js';
import { ethers } from 'ethers';

const unitOptions = ["wei", "gwei", "finney", "ether"];

export default function PublicArt({ contract }) {
    const [price, setPrice] = useState("0");
    const [unit, setUnit] = useState("wei");
    const [metadataURI, setMetadataURI] = useState("");

    const handleSubmit = async () => {
        try {
            let weiAmount = unit === "wei" ? ethers.parseUnits(price, 0) : ethers.parseUnits(price, unit); 
            const receipt = await publicNewArtwork(contract, weiAmount, metadataURI);
            console.log(receipt);
            alert("Transaction successful! Check your wallet for the new artwork.");
            // const weiAmount = ethers.parseUnits
        } catch (error) {
            alert(error.message); 
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ece5e0",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    p: 4,
                    width: 400,
                    backgroundColor: "#d6cbc7",
                    borderRadius: 2,
                }}
            >
                {/* VALUE */}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#003300" }}>
                    VALUE
                </Typography>
                <FormControl fullWidth>
                    <OutlinedInput
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <Select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    variant="standard"
                                    disableUnderline
                                >
                                    {unitOptions.map((u) => (
                                        <MenuItem key={u} value={u}>
                                            {u}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {/* METADATA */}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#003300" }}>
                    METADATA URI
                </Typography>

                <TextField
                    fullWidth
                    placeholder="e.g. https://ipfs.io/ipfs/QmYourCID/metadata.json"
                    value={metadataURI}
                    onChange={(e) => setMetadataURI(e.target.value)}
                />
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                    Enter the full URL to your metadata file (typically a .json file hosted on IPFS). You can upload your metadata to IPFS using decentralized storage services like:
                    <ul>
                        <li><a href="https://pinata.cloud/">Pinata</a></li>
                        <li><a href="https://web3.storage/">Web3.Storage
                        </a></li>
                        <li><a href="https://nft.storage/">NFT.Storage
                        </a></li>
                        <li>...</li>
                    </ul>
                    For step-by-step guidance, please refer to our <a href="#">IPFS Upload Guide</a> that covers the entire process in detail.
                </p>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

import { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { publicNewArtwork, parseUnits } from '../api/utils.js';
import { ethers } from 'ethers';
import { Link, useNavigate } from "react-router-dom";
import Value from "../components/Value.jsx";

const unitOptions = ["wei", "gwei", "finney", "ether"];

export default function PublicArt({ contract }) {
    const [price, setPrice] = useState("0");
    const [unit, setUnit] = useState("wei");
    const [metadataURI, setMetadataURI] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            if (BigInt(price) < 0n) {
                throw new Error("The Price must be greater than 0");
            }
            let weiAmount = parseUnits(unit, price); 
            const receipt = await publicNewArtwork(contract, weiAmount, metadataURI);
            console.log(receipt);
            navigate("/"); 
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
                <Value price={price} setUnit={setUnit} setPrice={setPrice} unit={unit}/>

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
                    For step-by-step guidance, please refer to our <Link to="/guide">IPFS Upload Guide</Link> that covers the entire process in detail.
                </p>
                {/* check metadata struct before send*/}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

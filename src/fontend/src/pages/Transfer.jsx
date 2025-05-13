import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Trash icon
import Loading from '../components/Loading';
import { getArtworkByTokenId, transfer } from '../api/utils';

// Placeholder image URL - find one that resembles a portrait
const nftImageUrl = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=120&h=180&q=80';

function Transfer({ contract, account }) {
    const navigate = useNavigate();
    const { tokenId } = useParams();
    const [art, setArt] = useState();
    const [metadata, setMetadata] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getArtworkByTokenId(contract, tokenId);
                const response = await fetch(res.metadataURI);
                const data = await response.json();
                setMetadata(data);
                setArt(res);

                console.log(data);
            } catch (error) {
                alert(error.message);
            }
        }

        fetchData();
    }, []);
    const [destinationAddress, setDestinationAddress] = useState('');


    const handleClearDestination = () => {
        setDestinationAddress('');
    };

    const handleTransfer = async () => {
        if (!destinationAddress.trim()) {
            alert("Please enter a destination address.");
            return;
        }
        try {
            await transfer(contract, account, destinationAddress, tokenId);
            alert("success"); 
            navigate("/");
        } catch(error) {
            alert(error.message);
        }
    };

    if (!metadata || !art) {
        return <Loading />;
    }

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                py: { xs: 4, md: 6 }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    p: 2,
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        mb: 3.5,
                        textAlign: 'center',
                    }}
                >
                    Transfer
                </Typography>

                <Paper
                    elevation={2}
                    sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        mb: 3.5,
                        display: 'inline-block',
                        backgroundColor: 'common.white',
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            width: 130,
                            height: 195,
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: '6px',
                        }}
                        alt={`Artwork for ${metadata.name}`}
                        src={metadata.image}
                    />
                </Paper>

                <Typography variant="body1" sx={{ mb: 1.5, alignSelf: 'flex-start', width: '100%', fontWeight: 500 }}>
                    Transfer "{metadata.name}" to:
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="e.g. 0x1ed3... or destination.eth, destination.lens"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': {

                            },
                            '&:hover fieldset': {

                            },
                            '&.Mui-focused fieldset': {

                            },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {destinationAddress && (
                                    <IconButton
                                        aria-label="clear destination address"
                                        onClick={handleClearDestination}
                                        edge="end"
                                        size="small"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleTransfer}
                    sx={{
                        backgroundColor: '#B7D3EB',
                        color: '#37474F',
                        '&:hover': {
                            backgroundColor: '#A1C5E0',
                        },
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1.25,
                        borderRadius: '8px',
                        boxShadow: 'none',
                    }}
                >
                    Transfer
                </Button>
            </Box>
        </Container>
    );
}

export default Transfer;
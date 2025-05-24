import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Grid,
    Box,
    Paper,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
} from '@mui/material';
import {
    WbSunny as DiamondIcon,
    Send as SendIcon,
    ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon,
    Style as StyleIcon,
    ListAlt as ListAltIcon,
    ShowChart as ShowChartIcon,
    History as HistoryIcon,
    Event as EventIcon,
    LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { getArtworkByTokenId, shortenAddress, events } from '../api/utils';
import { usePE } from '../hooks/usePE';
import { getMetadata } from '../api/storage';
import { isAddress } from 'ethers';
import Loading from './Loading';
import ValueDialog from './ValueDialog';
import PriceChart from './PriceChart';
import TransferHistory from './TransferHistory';
import EventStats from './EventStats';

function CardDetail() {
    const { contract, account, pinata } = usePE();
    const { tokenId } = useParams();
    const [art, setArt] = useState();
    const [metadata, setMetadata] = useState();
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState();

    const [expandedAccordion, setExpandedAccordion] = useState({
        description: true,
        traits: true,
        details: false,
        priceHistory: true,
        listings: false,
        events: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const evts = await events(contract, tokenId);
                setEvent(evts);
                const res = await getArtworkByTokenId(contract, tokenId);
                setMetadata(await getMetadata(pinata, res.metadataURI));
                setArt(res);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [contract, tokenId, pinata]);

    const handleClickOpen = () => setOpen(true);
    const handleAccordionChange = (panel) => (_, isExpanded) => {
        setExpandedAccordion(prev => ({ ...prev, [panel]: isExpanded }));
    };

    const AccordionSection = ({ id, title, icon, children }) => (
        <Accordion
            expanded={expandedAccordion[id]}
            onChange={handleAccordionChange(id)}
            sx={{ '&:before': { display: 'none' }, boxShadow: 'none', borderBottom: '1px solid', borderColor: 'divider' }}
            disableGutters
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
                sx={{ flexDirection: 'row-reverse', py: 0.5, minHeight: '48px' }}
            >
                {icon}
                <Typography sx={{ fontWeight: 'medium', ml: 1 }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );

    const handleTrait = (trait_type, value) => {
        const type = trait_type.toLowerCase();
        if (type === "author" && isAddress(value)) {
            return <Link to={`/${value}`}>{value.toLowerCase() === account.toLowerCase() ? "You" : shortenAddress(value)}</Link>;
        } else if (type === "date") {
            return new Date(value).toString();
        }
        return value;
    };

    if (!metadata || !art) return <Loading />;
    if (open) return <ValueDialog open={open} setOpen={setOpen} tokenId={tokenId} p={art.price} msg={art.owner === account ? (art.status ? "Change Price" : "Resell") : "Buy"} />;

    return (
        <>
            <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit"><DiamondIcon /></IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    {account.toLowerCase() === art.owner.toLowerCase() && (
                        <IconButton color="inherit"><Link to={`/transfer/${tokenId}`}><SendIcon /></Link></IconButton>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{
                                height: 400,
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}>
                                {metadata.video ? (
                                    <video
                                        controls
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                        poster={undefined}
                                    >
                                        <source src={metadata.image} />
                                        Video Not Supported
                                    </video>
                                ) : (
                                    <a href={metadata.image} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={metadata.image}
                                            alt={metadata.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </a>
                                )}
                            </Box>

                            <Box>
                                <AccordionSection id="description" title="Description" icon={<DescriptionIcon fontSize="small" color="action" />}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                        By <Link to={`/${event.AssetCreated.author}`}>{event.AssetCreated.author === account ? "You" : shortenAddress(event.AssetCreated.author)}</Link>
                                    </Typography>
                                    <Typography variant="body2" sx={{ maxHeight: 150, overflowY: 'auto', fontSize: '0.875rem' }}>{metadata.description}</Typography>
                                </AccordionSection>
                                <AccordionSection id="traits" title="Traits" icon={<StyleIcon fontSize="small" color="action" />}>
                                    <Grid container spacing={1}>
                                        {metadata.attributes?.map(({ trait_type, value }, i) => (
                                            <Grid item xs={6} key={i}>
                                                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', backgroundColor: 'grey.50' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{trait_type}</Typography>
                                                    <Typography variant="subtitle2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>{handleTrait(trait_type, value)}</Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </AccordionSection>
                                <AccordionSection id="details" title="Details" icon={<ListAltIcon fontSize="small" color="action" />}>
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                        <p>Token Id: {tokenId}</p>
                                        <p>Price: {art.price} ETH</p>
                                        <p>Status: {art.status ? "For Sale" : "Not For Sale"}</p>
                                        <p>Owner: <Link to={`/${art.owner}`}>{art.owner === account ? "You" : shortenAddress(art.owner)}</Link></p>
                                        <p>Name: {metadata.name}</p>
                                        <p>Description: {metadata.description}</p>
                                        <p><a href={metadata.image}>Image</a></p>
                                    </Typography>
                                </AccordionSection>
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '60%' }, display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={2.5}>
                            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Typography variant="h4" component="h1" fontWeight="bold">{`${metadata.name} #${tokenId}`}</Typography>
                                <Typography variant="body2" color="text.secondary">Owned by <Link to={`/${art.owner}`}>{handleTrait("author", art.owner)}</Link></Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Button variant="contained" color="primary" fullWidth startIcon={<LocalOfferIcon />} size="large" onClick={handleClickOpen}>
                                    {art.owner === account ? (art.status ? "Change Price" : "Resell") : "Buy"}
                                </Button>
                            </Paper>
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <AccordionSection id="priceHistory" title="Price History" icon={<ShowChartIcon fontSize="small" color="action" />}>
                                    <PriceChart tokenId={tokenId} />
                                </AccordionSection>
                            </Paper>
                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <AccordionSection id="listings" title="Transaction History" icon={<HistoryIcon fontSize="small" color="action" />}>
                                    <TransferHistory tokenId={tokenId} />
                                </AccordionSection>
                            </Paper>
                            <Paper elevation={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <AccordionSection id="events" title="Events" icon={<EventIcon fontSize="small" color="action" />}>
                                    <EventStats event={event} />
                                </AccordionSection>
                            </Paper>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default CardDetail;

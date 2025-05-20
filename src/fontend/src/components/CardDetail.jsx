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
    Chip,
    Stack,
} from '@mui/material';
import {
    WbSunny as DiamondIcon,
    Refresh as RefreshIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Share as ShareIcon,
    MoreHoriz as MoreHorizIcon,
    Visibility as VisibilityIcon,
    Palette as PaletteIcon,
    ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon,
    Style as StyleIcon,
    InfoOutlined as InfoOutlinedIcon,
    ListAlt as ListAltIcon,
    ShowChart as ShowChartIcon,
    Storefront as StorefrontIcon,
    LocalOffer as LocalOfferIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import { getArtworkByTokenId, shortenAddress, changeOrResell, events } from '../api/utils';
import { useParams, Link } from 'react-router-dom';
import Loading from './Loading';
import SendIcon from '@mui/icons-material/Send';
import ValueDialog from './ValueDialog';
import PriceChart from './PriceChart';
import TransferHistory from './TransferHistory';
import EventStats from './EventStats';
import { usePE } from '../hooks/usePE';
import { getMetadata } from '../api/storage';
import { isAddress } from 'ethers';

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
        about: false,
        details: false,
        priceHistory: true,
        listings: false,
        offers: true,
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
                alert(error.message);
            }
        }

        fetchData();
    }, []);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(prev => ({ ...prev, [panel]: isExpanded }));
    };
    const AccordionSection = ({ id, title, icon, children, defaultExpanded = false }) => (
        <Accordion
            expanded={expandedAccordion[id]}
            onChange={handleAccordionChange(id)}
            sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 'none' }
            }}
            disableGutters
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
                sx={{
                    flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(180deg)',
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 1,
                    },
                    py: 0.5,
                    minHeight: '48px',
                    '&.Mui-expanded': {
                        minHeight: '48px',
                    }
                }}
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
            return <Link to={`/${value}`}>{value.toString() === account ? "You" : shortenAddress(value)}</Link>;
        } else if (type === "date") {
            return (new Date(value)).toString();
        }
        return value;
    }


    if (!metadata || !art) {
        return (<Loading />);
    }

    if (open) {
        return <ValueDialog
            open={open}
            setOpen={setOpen}
            tokenId={tokenId}
            p={art.price}
            msg={art.owner === account ? (art.status ? "Change Price" : "Resell") : "Buy"} />;
    }
    return (
        <>
            <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo">
                        <DiamondIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    {account.toLowerCase() === art.owner.toLowerCase() && (
                        <IconButton color="inherit"><Link to={`/transfer/${tokenId}`}><SendIcon /></Link></IconButton>
                    )}
                </Toolbar>
            </AppBar>


            <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>

                    <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    height: { xs: 280, sm: 350, md: 400 },
                                    backgroundColor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <a href={metadata.image} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={metadata.image}
                                            alt={metadata.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                    </a>
                                </div>
                            </Box>

                            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                                <AccordionSection id="description" title="Description" icon={<DescriptionIcon fontSize="small" color="action" />} defaultExpanded>
                                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                                        By <Link to={`/${event.AssetCreated.author}`} underline="hover" sx={{ fontWeight: 'medium' }}>{event.AssetCreated.author === account ? "You" : shortenAddress(event.AssetCreated.author)}</Link>
                                    </Typography>
                                    <Box sx={{ maxHeight: 150, overflowY: 'auto', pr: 0.5, fontSize: '0.875rem', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'grey.400', borderRadius: '3px' } }}>
                                        {metadata.description}
                                    </Box>
                                </AccordionSection>
                                <AccordionSection id="traits" title="Traits" icon={<StyleIcon fontSize="small" color="action" />} defaultExpanded>
                                    <Grid container spacing={1}>
                                        {metadata.attributes?.map(({ trait_type, value }, i) => (
                                            <Grid item xs={6} key={i}>
                                                <Paper variant="outlined" sx={{ p: 1.2, textAlign: 'center', backgroundColor: 'grey.50', height: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.25 }}>
                                                        {trait_type}
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                                                        {handleTrait(trait_type, value)}
                                                    </Typography>
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
                        <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
                            <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Link href="#" underline="hover" variant="body2" display="flex" alignItems="center" sx={{ color: 'primary.main', fontWeight: 'medium', mb: 0.5 }}>
                                    {`${metadata.name} #${tokenId}`} by {handleTrait("author", event.AssetCreated.author)}
                                    <Box component="span" sx={{ ml: 0.5 }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.2239 6.13491L8.40633 2.01825C8.18073 1.82736 7.82854 1.82736 7.60294 2.01825L2.78538 6.13491C2.56855 6.31809 2.52008 6.63111 2.67002 6.86368L2.67679 6.87286C2.82761 7.1069 3.13125 7.17032 3.37379 7.03688L3.38038 7.03268L7.40584 3.67752V10.8998C7.40584 11.176 7.62988 11.3999 7.90609 11.3999C8.1823 11.3999 8.40633 11.176 8.40633 10.8998V3.67752L12.4241 7.03268L12.4319 7.03688C12.6744 7.17032 12.9781 7.1069 13.1289 6.87286L13.1357 6.86368C13.2856 6.63111 13.2371 6.31809 13.0203 6.13491H13.0203L13.2239 6.13491ZM8.00463 14C10.2137 14 12.0046 12.2091 12.0046 10C12.0046 9.72386 11.7806 9.5 11.5044 9.5C11.2282 9.5 11.0042 9.72386 11.0042 10C11.0042 11.6569 9.66149 13 8.00463 13C6.34778 13 5.00488 11.6569 5.00488 10C5.00488 9.72386 4.78084 9.5 4.50463 9.5C4.22842 9.5 4.00438 9.72386 4.00438 10C4.00438 12.2091 5.79528 14 8.00463 14Z" fill="currentColor"></path></svg>
                                    </Box>
                                </Link>
                                <Typography variant="h4" component="h1" fontWeight="bold" my={0.5} sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                                    {`${metadata.name} #${tokenId}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                    Owned by <Link href="#" underline="hover" sx={{ fontWeight: 'medium' }}>{handleTrait("author", art.owner)}</Link>
                                </Typography>
                            </Paper>

                            <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<LocalOfferIcon />}
                                    size="large"
                                    sx={{ fontWeight: 'medium' }}
                                    onClick={handleClickOpen}

                                >
                                    {art.owner === account ? (art.status ? "Change Price" : "Resell") : "Buy"}
                                </Button>
                            </Paper>

                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                <AccordionSection id="priceHistory" title="Price History" icon={<ShowChartIcon fontSize="small" color="action" />} defaultExpanded>
                                    <PriceChart tokenId={tokenId}/>
                                </AccordionSection>
                            </Paper>

                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                <AccordionSection id="listings" title="Transaction History" icon={<HistoryIcon fontSize="small" color="action" />}>
                                    <TransferHistory tokenId={tokenId}/>
                                </AccordionSection>
                            </Paper>

                            <Paper elevation={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                <AccordionSection id="events" title="Events" icon={<EventIcon fontSize="small" color="action" />}>
                                    <EventStats event={event}/>
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
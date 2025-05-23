import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { usePE } from '../hooks/usePE';
import { uploadToIPFS } from '../api/storage';
import { publicNewArtwork, parseUnits, signInWithEthereum } from '../api/utils';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const steps = ['Sign In With Ethereum', 'Upload To IPFS', 'Minting'];

export default function AutoProcess({ open, setOpen, data, file, price, unit }) {
    const { contract, pinata, signer, account } = usePE();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleClickOpen = () => {
        console.log(data, file, price, unit);
        setOpen(true);
    };

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    

    // Memoize upload function
    const upload = React.useCallback(async () => {
        try {
            const { message, signature, nonce } = await signInWithEthereum(signer, account, import.meta.env.VITE_SERVER_URL, window.location) 
            handleNext()

            const url = `${import.meta.env.VITE_SERVER_URL}/presigned-url`;
            const metadata = await uploadToIPFS(pinata, url, file, data, message, signature, nonce);
            handleNext();

            const weiAmount = parseUnits(unit, price);
            await publicNewArtwork(contract, weiAmount, metadata, data.name);
            handleNext();

            navigate("/");
        } catch (error) {
            console.log("FROM AUTO PROCESS")
            console.error(error)
            alert(error.message);
        }
    }, [pinata, file, data, unit, price, contract, navigate]);

    // Upload effect only when open
    React.useEffect(() => {
        if (open) {
            upload();
        }
    }, [open, upload]);

    // Memoize step elements
    const stepElements = React.useMemo(() =>
        steps.map((label) => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
        )), []);

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create
            </Button>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Mint NFT
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {stepElements}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you're finished
                            </Typography>
                        ) : (
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    Step {activeStep + 1}
                                </Typography>
                                <CircularProgress />
                            </>
                        )}
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </>
    );
}

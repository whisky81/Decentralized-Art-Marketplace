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
import { useNavigate } from "react-router-dom"
import { usePE } from '../hooks/usePE';
import { uploadToIPFS } from '../api/storage';
import { publicNewArtwork, parseUnits } from '../api/utils';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const steps = ['Upload To IPFS', 'Minting'];
export default function AutoProcess({ open, setOpen, data, file, price, unit }) {
    const { contract, pinata } = usePE()
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = React.useState(0);

    const handleClickOpen = () => {
        console.log(data) 
        console.log(file)
        console.log(price)
        console.log(unit) 
        setOpen(true);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };


    React.useEffect(() => {
        if (open) {
            const upload = async () => {
                try {
                    const url = `${import.meta.env.VITE_SERVER_URL}/presigned-url`
                    const metadata = await uploadToIPFS(pinata, url, file, data)
                    handleNext();


                    let weiAmount = parseUnits(unit, price);
                    await publicNewArtwork(contract, weiAmount, metadata, data.name) 
                    handleNext();

                    navigate("/")
                } catch (error) {
                    alert(error.message)
                }
            };

            upload();
        }
    }, [open]);

    return (
        <React.Fragment>
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
                            {steps.map((label, index) => {
                                return (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                                <CircularProgress />
                            </React.Fragment>
                        )}
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}

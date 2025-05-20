import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Value from './Value';
import { useNavigate } from "react-router-dom";
import { changeOrResell, parseUnits, buy, isOwnerOf } from "../api/utils";
import { usePE } from "../hooks/usePE";
function ValueDialog({ open, setOpen, tokenId, p, msg }) {
    const { account, contract } = usePE()
    const [price, setPrice] = useState(p);
    const [unit, setUnit] = useState("ether");
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            if (msg !== "Buy") {

                await changeOrResell(contract, tokenId, parseUnits(unit, price));
            } else {
                await buy(contract, tokenId, parseUnits(unit, price));
                const ok = await isOwnerOf(contract, tokenId, account);
                if (ok) {
                    alert("SUCCESS");
                } else {
                    alert("Transaction failed due to insufficient balance");
                }
            }

            navigate("/");
        } catch (error) {
            // alert(error.message);
            console.error(error)
        }
    }


    return (
        <>
            <Dialog open={open} onClose={(e) => { setOpen(false); }}>
                <DialogTitle>Price</DialogTitle>
                <DialogContent>
                    <Value price={price} unit={unit} setPrice={setPrice} setUnit={setUnit} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => { setOpen(false); }}>Cancel</Button>
                    <Button onClick={handleClick}>{msg}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ValueDialog;

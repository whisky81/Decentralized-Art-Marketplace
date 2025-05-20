
import {
    MenuItem,
    Typography,
    InputAdornment,
    FormControl,
    Select,
    OutlinedInput,
} from "@mui/material";


const unitOptions = ["wei", "gwei", "finney", "ether"];

export default function Value({ price, setUnit, setPrice, unit }) {
    return (<div><Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#003300" }}>
        PRICE
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
        </FormControl></div>);
}
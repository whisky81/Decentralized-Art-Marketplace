import { Box, Typography } from "@mui/material";


export default function NotForSale() {
    return (<Box display="flex" alignItems="center">
        <Box
            sx={{
                width: 12,
                height: 12,
                bgcolor: 'red',
                borderRadius: '50%',
                mr: 1,
            }}
        />
        <Typography variant="body2">Not For Sale</Typography>
    </Box>);
}
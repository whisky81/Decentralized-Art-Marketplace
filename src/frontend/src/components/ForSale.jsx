import { Box, Typography } from "@mui/material";

export default function ForSale() {
    return (<Box display="flex" alignItems="center">
        <Box
            sx={{
                width: 12,
                height: 12,
                bgcolor: 'green',
                borderRadius: '50%',
                mr: 1,
            }}
        />
        <Typography variant="body2">For Sale</Typography>
    </Box>);
}
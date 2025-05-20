import { Box, Typography } from "@mui/material";

export default function EmptyState({ icon, primaryText, secondaryText }) {
    return (<Box textAlign="center" py={5} color="text.secondary">
                {icon}
                <Typography variant="subtitle1" gutterBottom>{primaryText}</Typography>
                {secondaryText && <Typography variant="body2">{secondaryText}</Typography>}
            </Box>);
}
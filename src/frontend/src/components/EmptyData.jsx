
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyData = ({ message = "No data available." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="200px"
      color="text.secondary"
    >
      <InboxIcon fontSize="large" />
      <Typography variant="body1" mt={1}>
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyData;

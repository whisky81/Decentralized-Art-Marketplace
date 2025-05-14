import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";
import { shortenAddress } from "../api/utils";

export default function EventStats({ event, account }) {
  const helper = (acc1, acc2) =>
    acc1.toLowerCase() === acc2.toLowerCase() ? "you" : shortenAddress(acc2);

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>Mint</Typography>
<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell>Token ID</TableCell>
      <TableCell>Price</TableCell>
      <TableCell>Metadata</TableCell>
      <TableCell>Author</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>
        <Link component={RouterLink} to={`/nft/${event.AssetCreated.tokenId}`}>
          {event.AssetCreated.tokenId}
        </Link>
      </TableCell>
      <TableCell>{event.AssetCreated.price} ETH</TableCell>
      <TableCell>
        <Link href={event.AssetCreated.metadataURI} target="_blank">View</Link>
      </TableCell>
      <TableCell>
        <Link component={RouterLink} to={`/${event.AssetCreated.author}`}>
          {helper(account, event.AssetCreated.author)}
        </Link>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>


      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Asset Sold</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Token ID</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Metadata</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Buyer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {event.AssetSold?.slice().reverse().map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link component={RouterLink} to={`/nft/${item.tokenId}`}>
                      {item.tokenId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.price} ETH</TableCell>
                  <TableCell>
                    <Link href={item.metadataURI} target="_blank">View</Link>
                  </TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/${item.owner}`}>
                      {helper(account, item.owner)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/${item.buyer}`}>
                      {helper(account, item.buyer)}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Asset Resell</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Token ID</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {event.AssetResell?.slice().reverse().map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link component={RouterLink} to={`/nft/${item.tokenId}`}>
                      {item.tokenId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.price} ETH</TableCell>
                  <TableCell>{item.status ? "Success" : "Failed"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

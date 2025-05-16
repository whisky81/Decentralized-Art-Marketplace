import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  IconButton,
  Box,
  Tooltip,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

const uris = [
  "https://bafybeigqoisyustdxxpd2n44vjasz4xjcbhrdn57r7fxghfrtntgordggq.ipfs.w3s.link/0.json",
  "https://bafybeigqoisyustdxxpd2n44vjasz4xjcbhrdn57r7fxghfrtntgordggq.ipfs.w3s.link/1.json",
  "https://bafybeigqoisyustdxxpd2n44vjasz4xjcbhrdn57r7fxghfrtntgordggq.ipfs.w3s.link/2.json",
  "https://bafybeib6pd45duowxdjgryrrs6jewyropreq4gnjecw456ppl2zgn2dzl4.ipfs.w3s.link/3.json",
  "https://bafybeiefpvxwy4jovmhj4idnn7mzan3zk74hgepmjvrupsvtbmeb4wazu4.ipfs.w3s.link/4.json"
];

const metadataExample = {
  name: "NFT Title",
  description: "NFT Description",
  image: "ipfs://...",
  external_url: "https://example.com",
  attributes: [
    {
      trait_type: "Author",
      value: "0x123...789"
    },
    {
      trait_type: "Date",
      value: "2025-01-01"
    }
  ]
};

export default function Guide() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Box p={2} sx={{ backgroundColor: '#f1eae5', minHeight: '100vh' }}>
      <p>Make another account page + check metadata structure before upload to the blockchain network + {"send value <= msg.sender.balance"}</p>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Metadata URIs for Testing
          </Typography>
          <List dense>
            {uris.map((uri, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Copy URI">
                      <IconButton onClick={() => copyToClipboard(uri, index)}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    {copiedIndex === index && (
                      <Typography variant="caption" color="success.main">
                        Copied
                      </Typography>
                    )}
                  </Stack>
                }
              >
                <a
                  href={uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#1976d2' }}
                >
                  {uri}
                </a>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uploading Metadata to IPFS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can upload your metadata to IPFS using decentralized storage services such as:
          </Typography>
          <List dense>
            <ListItem>
              <a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer">
                • Pinata
              </a>
            </ListItem>
            <ListItem>
              <a href="https://web3.storage" target="_blank" rel="noopener noreferrer">
                • Web3.Storage
              </a>
            </ListItem>
            <ListItem>
              <a href="https://nft.storage" target="_blank" rel="noopener noreferrer">
                • NFT.Storage
              </a>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Metadata Format Example
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Make sure your metadata follows this structure to render properly in the user interface.
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 2,
              overflowX: 'auto',
              fontSize: '0.9rem'
            }}
          >
            {JSON.stringify(metadataExample, null, 2)}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

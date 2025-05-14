import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { getTransferHistory, shortenAddress } from '../api/utils';
import EmptyData from './EmptyData';
const TransferTable = ({ contract, tokenId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const txs = await getTransferHistory(contract, tokenId);
      setTransactions(txs);
      setFiltered(txs);
    };
    fetchData();
  }, [contract, tokenId]);

  useEffect(() => {
    let result = [...transactions];
    if (statusFilter) {
      result = result.filter(tx => {
        if (statusFilter === "success") {
            return tx.status === true; 
        }
        return tx.status === false; 
      });
    }
    if (search) {
      result = result.filter(tx =>
        tx.seller?.toLowerCase().includes(search.toLowerCase()) ||
        tx.buyer?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [statusFilter, search, transactions]);

  if (!transactions.length) return <EmptyData />;

  const formatDate = (ts) => {
    const date = new Date(ts * 1000);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Transfer History
        </Typography>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField
            label="Search Seller / Buyer"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Price (ETH)</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.price}</TableCell>
                  <TableCell>{shortenAddress(tx.seller)}</TableCell>
                  <TableCell>{shortenAddress(tx.buyer)}</TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  <TableCell>{tx.status ? "Success": "Failed"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};


export default TransferTable;

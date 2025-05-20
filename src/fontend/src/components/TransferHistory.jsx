import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { getTransferHistory, shortenAddress } from '../api/utils';
import EmptyData from './EmptyData';
import { usePE } from '../hooks/usePE';

const TransferTable = ({ tokenId }) => {
  const { contract } = usePE();
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Fetch only once per tokenId + contract
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const txs = await getTransferHistory(contract, tokenId);
        if (isMounted) setTransactions(txs);
      } catch (err) {
        console.error(err);
      }
    };
    if (contract && tokenId) fetchData();
    return () => { isMounted = false; };
  }, [contract, tokenId]);

  // useMemo to filter only when inputs change
  const filtered = useMemo(() => {
    let result = [...transactions];
    if (statusFilter) {
      result = result.filter(tx => statusFilter === 'success' ? tx.status : !tx.status);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(tx =>
        tx.seller?.toLowerCase().includes(q) ||
        tx.buyer?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, statusFilter, search]);

  const handleStatusChange = useCallback((e) => setStatusFilter(e.target.value), []);
  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);

  const formatDate = (ts) => new Date(ts * 1000).toLocaleString();

  if (!transactions.length) return <EmptyData />;

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
            onChange={handleSearchChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
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
                <TableRow key={tx.id || index}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.price}</TableCell>
                  <TableCell>{shortenAddress(tx.seller)}</TableCell>
                  <TableCell>{shortenAddress(tx.buyer)}</TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  <TableCell>{tx.status ? "Success" : "Failed"}</TableCell>
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

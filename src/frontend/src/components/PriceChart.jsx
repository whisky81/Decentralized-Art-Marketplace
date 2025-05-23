import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getTransferHistory } from '../api/utils';
import { useNavigate } from 'react-router-dom';
import EmptyData from './EmptyData';
import { usePE } from '../hooks/usePE';

const CustomTooltip = ({ active, payload, label }) => {
    const navigate = useNavigate();

    const handleClick = useCallback((addr) => {
        navigate(`/${addr}`);
    }, [navigate]);

    if (active && payload?.length) {
        const data = payload[0].payload;
        return (
            <div style={{
                background: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer'
            }}>
                <p><strong>{label}</strong></p>
                <p>price: {data.price} ETH</p>
                <p onClick={() => handleClick(data.seller)}>seller: {shortenAddress(data.seller)}</p>
                <p onClick={() => handleClick(data.buyer)}>buyer: {shortenAddress(data.buyer)}</p>
            </div>
        );
    }
    return null;
};

const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
};

const PriceChart = ({ tokenId }) => {
    const { contract } = usePE();
    const [transferHistory, setTransferHistory] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const transactions = await getTransferHistory(contract, tokenId);
                const filtered = transactions.filter(tx => tx.status).map(tx => ({
                    date: (new Date(tx.timestamp)).toLocaleDateString(),
                    price: tx.price,
                    seller: tx.seller,
                    buyer: tx.buyer
                }));
                if (isMounted) {
                    setTransferHistory(filtered);
                }
            } catch (error) {
                alert(error.message);
            }
        };

        if (contract && tokenId) fetchData();
        return () => { isMounted = false; };
    }, [contract, tokenId]);

    const chartData = useMemo(() => transferHistory ?? [], [transferHistory]);

    if (!transferHistory) return <EmptyData />;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                    PRICE
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `${v} ETH`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#0D47A1"
                            strokeWidth={3}
                            dot
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default PriceChart;

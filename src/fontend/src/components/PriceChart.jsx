import { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getTransferHistory } from '../api/utils';
import { Link, useNavigate } from 'react-router-dom';
import EmptyData from './EmptyData';
import { usePE } from '../hooks/usePE';
const CustomTooltip = ({ active, payload, label }) => {
    const navigate = useNavigate();

    const handleClick = (addr) => {
        navigate(`/${addr}`);
    };
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{
                background: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px'
            }}>
                <p><strong>{label}</strong></p>
                <p>price: {data.price} ETH</p>
                <p onClick={() => { handleClick(data.seller); }}>seller: {shortenAddress(data.seller)}</p>
                <p onClick={() => { handleClick(data.buyer); }}>buyer: {shortenAddress(data.buyer)}</p>
            </div>
        );
    }
    return null;
};

const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const PriceChart = ({ tokenId }) => {
    const { contract } = usePE()
    const [transferHistory, setTransferHistory] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactions = await getTransferHistory(contract, tokenId);
                const chartValues = [];
                for (const tx of transactions) {
                    if (!tx.status) continue; 
                    chartValues.push({
                        date: (new Date(tx.timestamp)).toLocaleDateString(),
                        price: tx.price,
                        seller: tx.seller,
                        buyer: tx.buyer
                    });
                }

                setData(chartValues);
                setTransferHistory(transactions);
            } catch (error) {
                alert(error.message);
            }
        };

        fetchData();
    }, [contract, tokenId]);

    if (!transferHistory) return <EmptyData />;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                    PRICE
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
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

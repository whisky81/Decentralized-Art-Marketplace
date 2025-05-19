import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { ethers } from "ethers";
import { getMyArts } from "../api/utils";
import { Box } from "@mui/material";
import MyCard from "../components/Card";
import AnotherAccount from "./AnotherAccount";
import { usePE } from "../hooks/usePE";

export default function MyWalletInfo() {
    const { contract, provider } = usePE();
    const { account } = useParams();
    const [data, setData] = useState();
    const [arts, setArts] = useState();

    const isSame = (acc1, acc2) => {
        return acc1.toLowerCase() === acc2.toLowerCase()
    }
    const handleAddress = () => {
        if (isSame(account, data.reqAcc)) {
            return `My Address: ${account}`;
        }
        return `Address: ${account}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestAccount] = await provider.send("eth_requestAccounts", []);

                const balance = await provider.getBalance(account);
                const network = await provider.getNetwork();

                setArts(await getMyArts(contract));

                setData({
                    reqAcc: requestAccount,
                    balance: ethers.formatEther(balance),
                    name: network.name,
                    chainId: network.chainId.toString()

                });
            } catch (error) {
                alert(error.message);

            }
        }

        fetchData();
    }, []);

    if (!data || !arts) {
        return <Loading />;
    }
    return (
        <Box
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            bgcolor="#f7f0eb" // Background
            p={2}
        >
            <Box
                sx={{
                    bgcolor: '#f5e9e1',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    maxWidth: 600,
                    width: '100%',
                    mb: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.01)',
                    },
                }}
            >
                <Box mb={2}>
                    <strong style={{ color: '#3b2f2f', fontSize: '1.1rem' }}>{handleAddress()}</strong>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <span style={{ fontWeight: 500, color: '#5e4b47' }}>Balance:</span>
                    <span style={{ fontWeight: 600 }}>{data.balance} ETH</span>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <span style={{ fontWeight: 500, color: '#5e4b47' }}>Network Name:</span>
                    <span style={{ fontWeight: 600 }}>{data.name ? data.name : 'Unknown'}</span>
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <span style={{ fontWeight: 500, color: '#5e4b47' }}>Network ID:</span>
                    <span style={{ fontWeight: 600 }}>{data.chainId}</span>
                </Box>
            </Box>


            <Box
                sx={{
                    bgcolor: '#e4d7d2',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: '1000px',
                    width: '100%',
                    mt: 0, // Remove extra top margin
                }}
            >
                {isSame(account, data.reqAcc) ? (
                    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                        {arts.map((art) => {
                            art.owner = account;
                            return (
                                <Link
                                    key={art.tokenId}
                                    to={`/nft/${art.tokenId}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <MyCard art={art} account={account} />
                                </Link>
                            );
                        })}
                    </Box>
                ) : (
                    <AnotherAccount />
                )}
            </Box>
        </Box>
    );

}

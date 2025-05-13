import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { ethers } from "ethers";
import { getMyArts } from "../api/utils";
import { Box } from "@mui/material";
import MyCard from "../components/Card";
import AnotherAccount from "./AnotherAccount";
export default function MyWalletInfo({ contract, provider }) {
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
        <div>
            <p>{handleAddress()}</p>
            <p>Balance: {data.balance} ETH</p>
            <p>Network Name: {data.name ? data.name : "Unknow"}</p>
            <p>Network Id: {data.chainId}</p>
            <hr />
            {isSame(account, data.reqAcc) ? 

            (<Box display="flex" flexWrap="wrap" gap={2}>
                {arts.map(art => {

                    art.owner = account;
                    return (
                        <Link to={`/nft/${art.tokenId}`} style={{ textDecoration: 'none', color: 'inherit' }}><MyCard key={art.tokenId} art={art} account={account} /></Link>

                    );
                })}
            </Box>) : (<AnotherAccount />)}
        </div>
    );
}

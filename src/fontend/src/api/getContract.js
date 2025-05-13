import Whisky from "@abis/Whisky.sol/Whisky.json"; 
import { ethers } from "ethers";

export default function getContract(signer) {
    return new Promise(async (resolve, reject) => {
        try {
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
            const contract = new ethers.Contract(
                contractAddress,
                Whisky.abi,
                signer
            );
            resolve(contract);
        } catch (error) {
            reject(error); 
        }
    });
}
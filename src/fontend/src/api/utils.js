import { ethers } from "ethers";

export function publicNewArtwork(contract, price, metadataURI) {
    return new Promise(async (resolve, reject) => {
        try {
            const tx = await contract.createAndSellAsset(price, metadataURI);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                resolve(receipt);
            } else {
                reject(new Error("Transaction failed"));
            }
        } catch (error) {
            reject(error);
        }
    });
}

export function artGallery(contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const proxyResult = Array.from(await contract.findAvailableAssets());
            resolve(handleProxyResult(proxyResult, 5));
        } catch (error) {
            reject(error);
        }
    });
}


export function handleProxyResult(proxyResult, fields) {
    const len = Object.keys(proxyResult[0]).length; 
    const res = [];
    for (let i = 0; i < len; i++) {
        const tmp = {
                tokenId: proxyResult[0][i].toString(),
                price: proxyResult[1][i].toString(),
                metadataURI: proxyResult[2][i],
                isAvailable: proxyResult[3][i].toString() === "0"
            };

        if (fields === 5) {
            tmp.owner = proxyResult[4][i];
        } else if (fields === 4) {
            
        }
        res.push(tmp);
    }
    return res;
} 

export function getArtworkByTokenId(contract, tokenId) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = Array.from(await contract.findAsset(tokenId)); 
            resolve({
                price: ethers.formatEther(res[0].toString()),
                status: (res[1].toString() === "0"),
                metadataURI: res[2],
                owner: res[3]
            });
        } catch(error) {
            reject(error.message);
        }
    });
} 


export function getMyArts(contract) {
    return new Promise(async (resolve, reject) => {
        try {
            const proxyResult = Array.from(await contract.findMyAssets());
            resolve(handleProxyResult(proxyResult, 4));
        } catch(error) {
            reject(error.message);
        }
    });
} 

export function transfer(contract, account, to, tokenId) {
    return new Promise(async (resolve, reject) => {
        try {
            const tx = await contract.transferFrom(account, to, tokenId);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                resolve(receipt);
            } else {
                reject(new Error("Transaction failed"));
            }
        } catch(error) {
            reject(error.message);
        }
    });
}
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
            resolve(handleProxyResult(proxyResult));
        } catch (error) {
            reject(error);
        }
    });
}


export function handleProxyResult(proxyResult) {
    const len = Object.keys(proxyResult[0]).length; 
    const res = [];
    for (let i = 0; i < len; i++) {
        res.push({
            tokenId: proxyResult[0][i].toString(),
            price: proxyResult[1][i].toString(),
            metadataURI: proxyResult[2][i],
            isAvailable: true,
            owner: proxyResult[4][i],
        });
    }
    return res;
}
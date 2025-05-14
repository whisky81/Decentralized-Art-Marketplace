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
    if (fields === 6) {
        res.push({
            id: proxyResult[0][i].toString(),
            price: ethers.formatEther(proxyResult[1][i]),
            seller: proxyResult[2][i],
            buyer: proxyResult[3][i],
            timestamp: Number(proxyResult[4][i]),
            status: Number(proxyResult[5][i]) === 1 
        });
    } else {
      const tmp = {
        tokenId: proxyResult[0][i].toString(),
        price: proxyResult[1][i].toString(),
        metadataURI: proxyResult[2][i],
        isAvailable: proxyResult[3][i].toString() === "0",
      };

      if (fields === 5) {
        tmp.owner = proxyResult[4][i];
      } else if (fields === 4) {
      }
      res.push(tmp);
    }
  }
  return res;
}

export function getArtworkByTokenId(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = Array.from(await contract.findAsset(tokenId));
      resolve({
        price: ethers.formatEther(res[0].toString()),
        status: res[1].toString() === "0",
        metadataURI: res[2],
        owner: res[3],
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

export function getMyArts(contract) {
  return new Promise(async (resolve, reject) => {
    try {
      const proxyResult = Array.from(await contract.findMyAssets());
      resolve(handleProxyResult(proxyResult, 4));
    } catch (error) {
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
    } catch (error) {
      reject(error.message);
    }
  });
}

export function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function changeOrResell(contract, tokenId, price) {
  return new Promise(async (resolve, reject) => {
    try {
      const tx = await contract.resellAsset(BigInt(tokenId), BigInt(price));
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        resolve(receipt);
      } else {
        reject(new Error("Transaction failed"));
      }
    } catch (error) {
      reject(error.message);
    }
  });
}

export function parseUnits(unit, price) {
  return unit === "wei"
    ? ethers.parseUnits(price, 0)
    : ethers.parseUnits(price, unit);
}

export function buy(contract, tokenId, price) {
  return new Promise(async (resolve, reject) => {
    try {
      const tx = await contract.buyAsset(BigInt(tokenId), {
        value: price,
      });
      const receipt = await tx.wait();
      console.log("ERROR1");
      console.log(receipt);
      if (receipt.status === 1) {
        resolve(receipt);
      } else {
        reject(new Error("Transaction failed"));
      }
    } catch (error) {
        console.log("ERROR2");
        console.error(error);
      reject(error.message);
    }
  });
}

export function getTransferHistory(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const proxyResult = Array.from(
        await contract.getAssetTransactions(BigInt(tokenId))
      );
      resolve(handleProxyResult(proxyResult, 6));
    } catch (error) {
      reject(error.message);
    }
  });
} 


export function isOwnerOf(contract, tokenId, account) {
    return new Promise(async (resolve, reject) => {
        try {
            const owner = await contract.ownerOf(BigInt(tokenId)); 
            console.log("OWNER: ", owner.toLowerCase());
            console.log("CURRENT ACCOUNT: ", account.toLowerCase());
            console.log(owner.toLowerCase() === account.toLowerCase());
            resolve(owner.toLowerCase() === account.toLowerCase()); 
        } catch(error) {
            reject(error.message);
        }
    });
}


export function events(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter;
      let events; 
      const res = {
        "AssetCreated": {},
        "AssetSold": [],
        "AssetResell": []
      };

      if ("AssetCreated" in contract.filters) {
        filter = contract.filters.AssetCreated();
        events = await contract.queryFilter(filter, 0, "latest"); // 0: tokenId 1: price 2: metadataURI 3:author {events}
        if (events.length) {
          for (const event of events) {
            if (event.args[0].toString() === tokenId) {
              res["AssetCreated"] = {
                tokenId: event.args[0].toString(),
                price: ethers.formatEther(event.args[1].toString()),
                metadataURI: event.args[2],
                author: event.args[3] 
              };
              break;
            }
          }
        }
      } 
      if ("AssetSold" in contract.filters) {
        filter = contract.filters.AssetSold();
        events = await contract.queryFilter(filter, 0, "latest");
        if (events.length) {
          for (const event of events) {
            if (event.args[0].toString() === tokenId) {
              res["AssetSold"].push({
                tokenId: event.args[0].toString(),
                price: ethers.formatEther(event.args[1].toString()),
                metadataURI: event.args[2],
                owner: event.args[3],
                buyer: event.args[4] 
              });
            } 
          }
        }
      }
      if ("AssetResell" in contract.filters) {
        filter = contract.filters.AssetResell(); 
        events = await contract.queryFilter(filter, 0, "latest");
        if (events.length) {
          for (const event of events) {
            if (event.args[0].toString() === tokenId) {
              res["AssetResell"].push({
                tokenId: event.args[0].toString(),
                status: Number(event.args[1]) === 0, 
                price: ethers.formatEther(event.args[2].toString())
              });
            } 
          }
        }
      }

      resolve(res);
    } catch(error) {
      reject(error.message);
    }
  });
}
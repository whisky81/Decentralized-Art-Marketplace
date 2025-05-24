import { ethers } from "ethers";
import Whisky from "@abis/Whisky.sol/Whisky.json";
import { SiweMessage } from "siwe"

export function signInWithEthereum(signer, account, url, location) {
  return new Promise(async (resolve, reject) => {
    try {
      const scheme = location.protocol.slice(0, -1);
      const domain = location.host;
      const origin = location.origin;
      let res = await fetch(`${url}/nonce`);
      const nonce = await res.text()
      let message = new SiweMessage({
        scheme,
        domain,
        address: account,
        statement: "verity your account to start mint nft",
        uri: origin,
        version: "1",
        chainId: "1",
        nonce,
      });
      message = message.prepareMessage();

      const signature = await signer.signMessage(message);
      console.log(signature);

      resolve({ message, signature, nonce }) 
    } catch (error) {
      reject(error);
    }
  });
}

export function getEthersProvider() {
  return new Promise((resolve, reject) => {
    // Wait for the window to load to ensure ethereum provider is injected
    window.addEventListener("load", async () => {
      try {
        // Check if MetaMask or a similar EIP-1193 provider is available
        if (window.ethereum) {
          console.log("Ethereum provider (e.g., MetaMask) detected.");
          // Create a BrowserProvider instance using the injected window.ethereum
          const provider = new ethers.BrowserProvider(window.ethereum);

          // Optional: Request account access and get the signer immediately.
          // This prompts the user to connect their wallet if not already connected.
          // If you only need to read data, you might not need the signer here.
          try {
            // Request accounts from the user
            await provider.send("eth_requestAccounts", []);
            console.log("Wallet connected.");
            // You can get the signer if needed: const signer = await provider.getSigner();
            resolve(provider); // Resolve the promise with the provider
          } catch (accountError) {
            console.error(
              "User denied account access or error occurred:",
              accountError
            );
            // Depending on the desired behavior, you might still resolve the provider
            // for read-only operations, or reject.
            // Let's reject if account access is denied, as it often implies user cancellation.
            reject(new Error("User denied account access."));
          }
        } else {
          throw new Error(
            "Please install the MetaMask extension in your browser.\nIf it’s already installed, make sure you're signed in."
          );
        }
      } catch (error) {
        // Catch any unexpected errors during provider setup
        console.error("Error initializing ethers provider:", error);
        reject(
          new Error(error?.reason || error?.message || "Transaction Failed")
        );
      }
    });
  });
}

export function getContract(signer) {
  return new Promise(async (resolve, reject) => {
    try {
      // const contractAddress = "0xbC9735456053FA37Cc4d237EA5FEE03A2cDFc25c";
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress, Whisky.abi, signer);
      resolve(contract);
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function publicNewArtwork(contract, price, metadataURI, name) {
  return new Promise(async (resolve, reject) => {
    try {
      const tx = await contract.createAndSellAsset(price, metadataURI, name);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        resolve(receipt);
      } else {
        reject(new Error("Transaction failed"));
      }
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

function handleReturnedAsset(proxyResult) {
  return {
    tokenId: proxyResult[0].toString(),
    owner: proxyResult[1],
    price: ethers.formatEther(proxyResult[2].toString()),
    status: proxyResult[3].toString() === "0",
    metadataURI: proxyResult[4],
    name: proxyResult[5],
    timestamp: Number(proxyResult[6]) * 1000,
  };
}

function handleAsset(proxyResult) {
  return {
    tokenId: proxyResult[0].toString(),
    price: ethers.formatEther(proxyResult[1].toString()),
    status: proxyResult[2].toString() === "0",
    metadataURI: proxyResult[3],
    name: proxyResult[4],
    timestamp: Number(proxyResult[5]) * 1000,
  };
}

function handleAssetTxn(proxyResult) {
  return {
    id: proxyResult[0].toString(),
    price: ethers.formatEther(proxyResult[1].toString()),
    seller: proxyResult[2],
    buyer: proxyResult[3],
    timestamp: Number(proxyResult[4]) * 1000,
    status: Number(proxyResult[5]) === 0,
  };
}

export function artGallery(contract) {
  return new Promise(async (resolve, reject) => {
    try {
      const proxyResult = Array.from(await contract.findAvailableAssets());
      const res = [];
      for (const obj of proxyResult) {
        res.push(handleReturnedAsset(obj));
      }
      resolve(res);
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function getArtworkByTokenId(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = Array.from(await contract.findAsset(tokenId));
      resolve(handleReturnedAsset(res));
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function getMyArts(contract) {
  return new Promise(async (resolve, reject) => {
    try {
      const proxyResult = Array.from(await contract.findMyAssets());
      const res = [];
      for (const obj of proxyResult) {
        res.push(handleAsset(obj));
      }
      resolve(res);
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
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
      reject(new Error(error?.reason || "Transaction Failed"));
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
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function parseUnits(unit, price) {
  return unit === "wei"
    ? ethers.parseUnits(price, 0)
    : ethers.parseUnits(price, unit);
}

// move check if msg.sender own this tokenid from ui
export function buy(contract, tokenId, price) {
  return new Promise(async (resolve, reject) => {
    try {
      // if (BigInt(price) <= 0n) {
      //   reject(new Error("The Value must be greater than 0"));
      // }

      const tx = await contract.buyAsset(BigInt(tokenId), {
        value: price,
      });
      const receipt = await tx.wait();
      console.log("RECEIPT");
      console.log(receipt);
      if (receipt.status === 1) {
        resolve(receipt);
      } else {
        reject(new Error("Transaction failed"));
      }
    } catch (error) {
      console.log("ERROR2");
      console.error(error);
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function getTransferHistory(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const proxyResult = Array.from(
        await contract.getAssetTransactions(BigInt(tokenId))
      );
      const res = [];
      for (const obj of proxyResult) {
        res.push(handleAssetTxn(obj));
      }
      resolve(res);
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

export function isOwnerOf(contract, tokenId, account) {
  return new Promise(async (resolve, reject) => {
    try {
      const owner = await contract.ownerOf(BigInt(tokenId));
      resolve(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

function handleAssetSoldEvent(obj) {
  return {
    tokenId: obj[0].toString(),
    name: obj[1],
    price: ethers.formatEther(obj[2].toString()),
    metadataURI: obj[3],
    owner: obj[4],
    buyer: obj[5],
  };
}

function handleAssetCreatedEvent(obj) {
  return {
    tokenId: obj[0].toString(),
    name: obj[1],
    price: ethers.formatEther(obj[2].toString()),
    metadataURI: obj[3],
    author: obj[4],
  };
}

function handleAssetResellEvent(obj) {
  return {
    tokenId: obj[0].toString(),
    status: Number(obj[1].toString()) === 0,
    price: ethers.formatEther(obj[2]),
  };
}

async function handleEvent(contract, tokenId, eventName) {
  const res = [];
  if (eventName in contract.filters) {
    const filter = contract.filters[eventName]();
    const events = await contract.queryFilter(filter, 0, "latest");
    if (events.length) {
      for (const event of events) {
        if (event.args[0].toString() === tokenId) {
          switch (eventName) {
            case "AssetCreated":
              res.push(handleAssetCreatedEvent(event.args));
              break;
            case "AssetSold":
              res.push(handleAssetSoldEvent(event.args));
              break;
            case "AssetResell":
              res.push(handleAssetResellEvent(event.args));
              break;
          }
          break;
        }
      }
    }
  }
  return res;
}

export function events(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = {
        AssetCreated: [],
        AssetSold: [],
        AssetResell: [],
      };
      res["AssetCreated"] = (
        await handleEvent(contract, tokenId, "AssetCreated")
      )[0];
      res["AssetSold"] = await handleEvent(contract, tokenId, "AssetSold");
      res["AssetResell"] = await handleEvent(contract, tokenId, "AssetResell");
      resolve(res);
    } catch (error) {
      reject(new Error(error?.reason || "Transaction Failed"));
    }
  });
}

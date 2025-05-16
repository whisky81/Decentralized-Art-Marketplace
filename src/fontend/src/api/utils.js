import { ethers } from "ethers";
import Whisky from "@abis/Whisky.sol/Whisky.json";

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
          // No injected provider found, fall back to a local development node
          console.log(
            "No injected Ethereum provider found, falling back to local node (http://127.0.0.1:9545)."
          );
          // Create a JsonRpcProvider connected to the local node
          // Make sure you have a local node running (e.g., Ganache, Hardhat Network)
          const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545");

          // Verify connection (optional, but good practice)
          try {
            await provider.getBlockNumber(); // Simple check to see if connection is working
            console.log("Connected to local node.");
            resolve(provider); // Resolve the promise with the local provider
          } catch (localNodeError) {
            console.error(
              "Could not connect to local node at http://127.0.0.1:9545.",
              localNodeError
            );
            reject(
              new Error(
                "Failed to connect to local node. Please ensure it's running."
              )
            );
          }
        }
      } catch (error) {
        // Catch any unexpected errors during provider setup
        console.error("Error initializing ethers provider:", error);
        reject(error);
      }
    }); // End of window.addEventListener

    // Optional: Add a timeout or handle cases where the 'load' event doesn't fire
    // or window.ethereum never becomes available.
    // setTimeout(() => reject(new Error("Provider setup timed out")), 10000); // Example timeout
  });
}

export function getContract(signer) {
  return new Promise(async (resolve, reject) => {
    try {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress, Whisky.abi, signer);
      resolve(contract);
    } catch (error) {
      reject(error);
    }
  });
}

export function publicNewArtwork(contract, price, metadataURI, name) {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMetadata(metadataURI);
      const tx = await contract.createAndSellAsset(price, metadataURI, name);
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

function checkMetadata(metadataURI) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(metadataURI);
      const data = await response.json();
      if (
        !data.hasOwnProperty("name") ||
        !data.hasOwnProperty("description") ||
        !data.hasOwnProperty("image")
      ) {
        reject(
          new Error("Metadata must be have name, description, image fields")
        );
      }
      resolve();
    } catch (error) {
      reject(error.message);
    }
  });
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
      reject(error);
    }
  });
}

export function getArtworkByTokenId(contract, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = Array.from(await contract.findAsset(tokenId));
      resolve(handleReturnedAsset(res));
    } catch (error) {
      reject(error.message);
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

// move check if msg.sender own this tokenid from ui
export function buy(contract, tokenId, price) {
  return new Promise(async (resolve, reject) => {
    try {
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
      const res = [];
      for (const obj of proxyResult) {
        res.push(handleAssetTxn(obj));
      }
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
}

export function isOwnerOf(contract, tokenId, account) {
  return new Promise(async (resolve, reject) => {
    try {
      const owner = await contract.ownerOf(BigInt(tokenId));
      resolve(owner.toLowerCase() === account.toLowerCase());
    } catch (error) {
      reject(error.message);
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
  if (contract.filters.hasOwnProperty(eventName)) {
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
      res["AssetCreated"] = handleEvent(contract, tokenId, "AssetCreated");
      res["AssetSold"] = handleEvent(contract, tokenId, "AssetSold");
      res["AssetResell"] = handleEvent(contract, tokenId, "AssetResell");
      resolve(res);
    } catch (error) {
      reject(error.message);
    }
  });
}

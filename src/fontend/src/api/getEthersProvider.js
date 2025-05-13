// Import ethers library (make sure you have it installed or included)
// For example, using a CDN:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.1/ethers.umd.min.js" integrity="sha512-3GSR7vNnF+N9skBDK+Z+Y/8Q+DBn/oGzI0nF+g7a/jI/Q/8Kq3qf/WccaHjYg+RDW/2E/k8GgA8/k/7/w/Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

/**
 * Initializes and returns an ethers.js provider.
 * It prioritizes the browser's injected provider (like MetaMask)
 * and falls back to a local JSON-RPC provider if none is found.
 *
 * @returns {Promise<ethers.Provider>} A promise that resolves with an ethers Provider instance.
 */ 
import { ethers } from "ethers"; // Ensure ethers is importe 
const getEthersProvider = () => {
  // Return a new Promise that resolves with the provider
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
             console.error("User denied account access or error occurred:", accountError);
             // Depending on the desired behavior, you might still resolve the provider
             // for read-only operations, or reject.
             // Let's reject if account access is denied, as it often implies user cancellation.
             reject(new Error("User denied account access."));
          }

        } else {
          // No injected provider found, fall back to a local development node
          console.log("No injected Ethereum provider found, falling back to local node (http://127.0.0.1:9545).");
          // Create a JsonRpcProvider connected to the local node
          // Make sure you have a local node running (e.g., Ganache, Hardhat Network)
          const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9545");

          // Verify connection (optional, but good practice)
          try {
            await provider.getBlockNumber(); // Simple check to see if connection is working
            console.log("Connected to local node.");
            resolve(provider); // Resolve the promise with the local provider
          } catch (localNodeError) {
             console.error("Could not connect to local node at http://127.0.0.1:9545.", localNodeError);
             reject(new Error("Failed to connect to local node. Please ensure it's running."));
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
};

export default getEthersProvider;

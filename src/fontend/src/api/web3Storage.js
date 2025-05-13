import { create } from "@web3-storage/w3up-client";

export async function getClient(email) {
  try {
    const client = await create();
    
    // Check if client is properly initialized
    if (!client) {
      throw new Error("Failed to initialize client");
    }

    // Login if needed
    const account = await client.login(email);
    await account.plan.wait();

    // Handle space creation if none exists
    if (client.spaces().length === 0) {
      await createNewSpace(client, account, "nft");
    }

    // Set current space
    const space = client.spaces()[0];
    await client.setCurrentSpace(space.did());

    return client;
  } catch (error) {
    throw new Error(`Client initialization failed: ${error.message}`);
  }
}

export async function uploadFile(client, file) {
  try {
    const cid = await client.uploadFile(file);
    return `https://${cid.toString()}.ipfs.w3s.link`;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function createNewSpace(client, account, name) {
  try {
    const space = await client.createSpace(name);
    await space.save();
    await account.provision(space.did());
    return space;
  } catch (error) {
    throw new Error(`Space creation failed: ${error.message}`);
  }
}

// import { create } from "@web3-storage/w3up-client";

// export function getClient(email) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const client = await create();

//       if (!Object.keys(client).length > 0) {
//         const account = await client.login(email);
//         await account.plan.wait();
//       }

//       if (!client.spaces().length > 0) {
//         await createNewSpace(client, email, "nft");
//       }
//       resolve(client);
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

// export function uploadFile(client, file) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cid = await client.uploadFile(file);
//       resolve(`https://${cid.toString()}.ipfs.w3s.link`);
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

// export function createNewSpace(client, email, name) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const account = new client.login(email);
//       await client.createSpace(name, { account });
//       resolve();
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

// export function setSpace(client, space) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await client.setCurrentSpace(space.did());
//       resolve();
//     } catch (error) {
//       reject(error.message);
//     }
//   });
// }

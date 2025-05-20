const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const getPresignedUrl = (url, message, signature, nonce) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature, nonce })
      });
      if (!response.ok) {
        throw new Error("Faild");
      }
      const data = await response.json();
      resolve(data.url);
    } catch (error) {
      reject(error);
    }
  });
};

export const getHTTPGateway = (pinata, cid) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await pinata.gateways.public.convert(cid));
    } catch (error) {
      console.log("GET HTTP GATEWAY")
      console.error(error)
      reject(error);
    }
  });
};

export const getMetadata = (pinata, cid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const http = await getHTTPGateway(pinata, cid);
      const res = await fetch(http);
      if (!res.ok) {
        throw new Error("Failed to fetch data from gateway");
      }
      const data = await res.json();
      data.image = await getHTTPGateway(pinata, data.image);
      console.log(cid)
      console.log(data) 
      resolve(data) 
    } catch (error) {
      console.log("GET METADATA")
      console.error(error)
      alert("Error: " + error.message);
    }
  });
};

export const uploadToIPFS = (pinata, url, file, data, message, signature, nonce) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file || file.size > MAX_SIZE) {
        throw new Error(
          "File size exceeds the 20 MB limit. Please select a smaller file. or file doesnt exist"
        );
      }
      if (!data) {
        throw new Error("Metadata (data) must be provided.");
      }
      if (!data.hasOwnProperty("name")) {
        throw new Error("Metadata must include a 'name' property.");
      }

      let presignedUrl = await getPresignedUrl(url, message, signature, nonce);

      console.log("---Presigned Url---");
      console.log(presignedUrl);

      const uploadImage = await pinata.upload.public
        .file(file)
        .url(presignedUrl);
      if (!uploadImage.cid) {
        throw new Error("Upload Image Failed");
      }

      console.log("---Uploaded Image cid---");
      console.log(uploadImage.cid);

      data.image = uploadImage.cid;

      const jsonBlob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const metadataFile = new File([jsonBlob], "metadata.json", {
        type: "application/json",
      });

      presignedUrl = await getPresignedUrl(url, message, signature, nonce);
      const uploadMetadata = await pinata.upload.public
        .file(metadataFile)
        .url(presignedUrl);

      if (!uploadMetadata.cid) {
        throw new Error("Upload Metadata Failed");
      }

      console.log("---upload Metadata Cid---");
      console.log(uploadMetadata.cid);

      resolve(uploadMetadata.cid);
    } catch (error) {
      reject(error);
    }
  });
};

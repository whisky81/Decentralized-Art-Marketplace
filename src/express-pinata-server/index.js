import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PinataSDK } from "pinata";
import { generateNonce, SiweMessage, SiweErrorType } from "siwe";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send('express pinata server')
});

app.get('/nonce', async function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(generateNonce())
});

const verify = async (req, res, next) => {
  try {
    if (!req.body.message || !req.body.signature || !req.body.nonce) {
      res.status(422).json({
        message: "Expected prepareMessage object and signature and nonce as body.",
      });
      return;
    }

    let SIWEObject = new SiweMessage(req.body.message);
    const { data: message } = await SIWEObject.verify({
      signature: req.body.signature,
      nonce: req.body.nonce,
    });
    next();
  } catch (e) {
    console.error(e);
    switch (e) {
      case SiweErrorType.EXPIRED_MESSAGE: {
        res.status(440).json({ message: e.message })
        break;
      }
      case SiweErrorType.INVALID_SIGNATURE: {
        res.status(422).json({ message: e.message })
        break;
      }
      default: {
        res.status(500).json({ message: e.message });
        break;
      }
    }
  }
}

app.post("/presigned-url", verify, async (req, res) => {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.GATEWAY_URL,
    });

    const url = await pinata.upload.public.createSignedURL({
      expires: 60,
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(8787, () => {
  console.log("server is running on http://localhost:8787/");
});

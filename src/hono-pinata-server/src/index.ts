import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PinataSDK } from 'pinata'

interface Bindings {
  PINATA_JWT: string,
  GATEWAY_URL: string
}

const app = new Hono<{ Bindings: Bindings}>()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/presigned-url', async (c) => {
  // handle Auth 

  const pinata = new PinataSDK({
    pinataJwt: c.env.PINATA_JWT,
    pinataGateway: c.env.GATEWAY_URL
  })

  const url = await pinata.upload.public.createSignedURL({
    expires: 60
  })

  return c.json({ url }, { status: 200 })
})

export default app

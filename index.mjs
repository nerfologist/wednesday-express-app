import express from "express"
import bodyParser from "body-parser"
import crypto from 'node:crypto'

import {
  addProductTag,
} from './graphqlClient.mjs'

const app = express()

export const hmacCheckMiddleware = async (req, res, next) => {
  const receivedHmac = req.headers['x-shopify-hmac-sha256']

  const generatedHmac = crypto
    .createHmac('sha256', process.env.WEBHOOK_HMAC_SECRET)
    .update(req.body, 'utf8', 'hex')
    .digest('base64')

  if (generatedHmac !== receivedHmac) {
    console.log("Received a request which failed HMAC validation, discarding")
    return res.sendStatus(401)
  }

  // Now, if you want to use the parsed body later in your app, you can parse it here:
  req.body = JSON.parse(req.body)
  next()
}

app.use(
  '/webhooks/:topic',
  bodyParser.raw({ type: 'application/json' }),
  hmacCheckMiddleware
)

app.post("/webhooks/:topic", (req, res) => {
  console.log("Webhook received, topic: ", req.headers["x-shopify-topic"])
  console.log("Payload: ", JSON.stringify(req.body, null, 2))
  console.log("Headers: ", JSON.stringify(req.headers, null, 2))

  const productGid = req.body["admin_graphql_api_id"]

  if (req.headers["x-shopify-topic"] === "products/update") {
    addProductTag(productGid, ["processed-by-webhook"])
    console.log("Tag successfully added to product!")
  }
  res.sendStatus(200)
})

app.get("*", function(req, res) {
  res.status(404).send("This route is not implemented")
})

app.listen(process.env.PORT, () => {
  console.log(
  `Server listening on ${process.env.PORT}, will be logging webhook payloads`
  )
})

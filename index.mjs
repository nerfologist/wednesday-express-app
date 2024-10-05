import express from "express"

const app = express()

// needed to parse JSON response bodies
app.use("/webhooks/:topic", express.json())

app.post("/webhooks/:topic", (req, res) => {
  console.log("Webhook received, topic: ", req.headers["x-shopify-topic"])
  console.log("Payload: ", JSON.stringify(req.body, null, 2))
  console.log("Headers: ", JSON.stringify(req.headers, null, 2))
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

import { GraphQLClient, gql } from 'graphql-request'

// set up the GraphQL client that we'll use throughout the app to query Shopify
// for whatever data we need
const client = new GraphQLClient(
  `https://${process.env.SHOP}.myshopify.com/admin/api/${process.env.API_VERSION}/graphql.json`,
  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    },
  }
)


const addProductTagMutation = gql`
  mutation AddProductTag($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        message
      }
    }
  }
`

export async function addProductTag(productGid, newTags) {
  const addProductTagResult = await client.request(
    addProductTagMutation, { id: productGid, tags: newTags }
  )
  return addProductTagResult
}

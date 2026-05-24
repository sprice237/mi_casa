import { db } from './db.js';
import { buildGqlServer } from './gql/index.js';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const yoga = buildGqlServer({ db, url: '/graphql' })

export const handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const response = await yoga.fetch(
    new URL(`https://${event.requestContext.domainName}${event.path}`),
    {
      method: event.httpMethod,
      headers: event.headers as HeadersInit,
      body: event.body
    },
  )

  const responseObject = {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
    isBase64Encoded: false
  };

  return responseObject
}
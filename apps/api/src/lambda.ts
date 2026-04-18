import { db } from './db.js';
import { buildGqlServer } from './gql/index.js';
import type { LambdaFunctionURLEvent } from 'aws-lambda'
import { pipeline } from 'stream/promises';

const yoga = buildGqlServer({ db, url: '/graphql' })

export const handler = awslambda.streamifyResponse(async function handler(
  event: LambdaFunctionURLEvent,
  responseStream,
) {
  const response = await yoga.fetch(
    // Construct the URL
    new URL(`https://${event.requestContext.domainName}${event.requestContext.http.path}?${event.rawQueryString}`),
    {
      method: event.requestContext.http.method,
      headers: event.headers as HeadersInit,
      // Parse the body if needed
      body: event.body && event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body
    },
  )

  // Attach the metadata to the response stream
  const httpResponseStream = awslambda.HttpResponseStream.from(responseStream, {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries())
  })

  // Pipe the response body to the response stream
  if (response.body) {
    await pipeline(response.body, httpResponseStream)
  }

  // End the response stream
  httpResponseStream.end()
})
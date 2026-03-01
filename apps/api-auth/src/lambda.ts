import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './app.js';
import { Context, LambdaFunctionURLEvent } from 'aws-lambda';

const proxy = awsLambdaFastify(init());

export const handler = async (event: LambdaFunctionURLEvent, context: Context) => proxy(event, context);
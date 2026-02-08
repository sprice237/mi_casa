import { GraphQLScalarType } from "graphql";

export const scalars = {
  DateTime: new GraphQLScalarType<object, string>({
    name: 'DateTime',
    serialize: (parsed) => (parsed as Date).toISOString(),
    parseValue: (raw) => new Date(raw as string),
  }),
  Json: new GraphQLScalarType<object, string>({
    name: 'Json',
    serialize: (parsed) => JSON.stringify(parsed),
    parseValue: (raw) => {
      try {
        return JSON.parse(raw as never)
      } catch (e) {
        console.error('An error occurred attempting to parse Json scalar value')
        throw e;
      }
    },
  })
}
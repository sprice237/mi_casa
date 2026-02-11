import { GraphQLScalarType } from "graphql";

export const scalars = {
  Date: new GraphQLScalarType<Date, string>({
    name: 'Date',
    serialize: (parsed) => {
      if (!(parsed instanceof Date)) {
        throw new Error(`Expected Date scalar to be a Date instance, but got: ${parsed}`);
      }
      return parsed.toISOString().split('T')[0];
    },
    parseValue: (raw) => {
      if (typeof raw !== 'string') {
        throw new Error(`Expected Date scalar to be a string, but got: ${raw}`);
      }
      const d = new Date(`${raw}T00:00:00Z`);
      if (isNaN(d.getTime())) {
        throw new Error(`Invalid Date string: ${raw}`);
      }
      return d;
    },
  }),
  DateTime: new GraphQLScalarType<Date, string>({
    name: 'DateTime',
    serialize: (parsed) => {
      if (!(parsed instanceof Date)) {
        throw new Error(`Expected DateTime scalar to be a Date instance, but got: ${parsed}`);
      }
      return parsed.toISOString();
    },
    parseValue: (raw) => {
      if (typeof raw !== 'string') {
        throw new Error(`Expected DateTime scalar to be a string, but got: ${raw}`);
      }
      const d = new Date(raw);
      if (isNaN(d.getTime())) {
        throw new Error(`Invalid DateTime string: ${raw}`);
      }
      return d;
    },
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
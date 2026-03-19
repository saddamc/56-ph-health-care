export default {
  schema: './schema/schema.prisma',
  config: {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  },
};
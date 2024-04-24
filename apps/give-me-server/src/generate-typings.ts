import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), 'apps/give-me-server/src/schema/graphql.ts'),
  outputAs: 'class',
  watch: true,
});

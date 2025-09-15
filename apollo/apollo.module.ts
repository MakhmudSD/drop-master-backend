import { Module } from '@nestjs/common';
import { apolloClient } from './apollo-client';

@Module({
  providers: [
    {
      provide: 'APOLLO_CLIENT',
      useValue: apolloClient,
    },
  ],
  exports: ['APOLLO_CLIENT'],
})
export class ApolloModule {}

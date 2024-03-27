import { Module } from '@nestjs/common';
import { CoreGqlSubscriptions } from './core.gql_subcriptions';
import { P2pGqlSubscriptions } from './p2p.gql_subcriptions';
import { TradeGqlSubscriptions } from './trade.gql_subcriptions';
import { FuturesGqlSubscriptions } from './futures.gql_subcriptions';

@Module({
  providers: [
    CoreGqlSubscriptions,
    TradeGqlSubscriptions,
    P2pGqlSubscriptions,
    FuturesGqlSubscriptions,
  ],
})
export class SubscriptionModule {}

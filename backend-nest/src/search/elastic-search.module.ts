import { Client } from "@elastic/elasticsearch";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const ES = Symbol("ES");

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: ES,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Client => {
        const url = config.get<string>("ELASTICSEARCH_URL");
        if (!url) throw new Error("ELASTICSEARCH_URL is not set");

        const username =
          config.get<string>("ELASTICSEARCH_USERNAME") ?? "elastic";
        const password = config.get<string>("ELASTICSEARCH_PASSWORD");
        if (!password) throw new Error("ELASTICSEARCH_PASSWORD is not set");

        return new Client({
          node: url,
          auth: { username, password },
          // Force ES 8-compatible media-type headers (server rejects 9)
          headers: {
            accept: "application/vnd.elasticsearch+json; compatible-with=8",
            "content-type":
              "application/vnd.elasticsearch+json; compatible-with=8",
          },
        });
      },
    },
  ],
  exports: [ES],
})
export class ElasticSearchModule {}

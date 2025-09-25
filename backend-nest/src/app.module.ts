import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DrizzleModule } from "./database/drizzle.module";
import { HealthModule } from "./health/health.module";
import { IngestModule } from "./ingest/ingest.module";
import { ElasticSearchModule } from "./search/elastic-search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IngestModule,
    HealthModule,
    DrizzleModule,
    ElasticSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

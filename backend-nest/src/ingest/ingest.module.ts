// src/ingest/ingest.module.ts

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { ElasticSearchModule } from "../search/elastic-search.module";
import { IngestController } from "./ingest.controller";
import { IngestService } from "./ingest.service";

@Module({
  imports: [HttpModule, DrizzleModule, ElasticSearchModule],
  providers: [IngestService],
  controllers: [IngestController],
  exports: [IngestService],
})
export class IngestModule {}

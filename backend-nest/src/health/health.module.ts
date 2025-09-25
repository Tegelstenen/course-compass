import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DrizzleModule } from "../database/drizzle.module";
import { ElasticSearchModule } from "../search/elastic-search.module";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  imports: [HttpModule.register({}), DrizzleModule, ElasticSearchModule],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}

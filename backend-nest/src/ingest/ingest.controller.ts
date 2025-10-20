// src/ingest/ingest.controller.ts
import { Controller, Get, HttpCode, Post } from "@nestjs/common";
import { IngestService } from "./ingest.service";

@Controller("ingest")
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  @Post("courses")
  @HttpCode(202)
  async trigger() {
    this.ingest.runFullIngest().catch((e) => console.error(e));
    return { status: "queued (in-process)", task: "courses" };
  }

  @Post("credits")
  @HttpCode(202)
  async ingestCredits() {
    this.ingest.ingestCredits().catch((e) => {
      console.error("Credits ingestion failed:", e);
      // In a production environment, you might want to send this to a monitoring service
    });
    return { status: "queued (in-process)", task: "credits" };
  }

  @Post("test-elastic")
  @HttpCode(200)
  async testElastic() {
    await this.ingest.runElasticTest();
    return { status: "queued", task: "test-elastic" };
  }

  @Get("credits/status")
  async getCreditsStatus() {
    const status = await this.ingest.getCreditsIngestionStatus();
    return {
      status: "success",
      data: status,
    };
  }
}

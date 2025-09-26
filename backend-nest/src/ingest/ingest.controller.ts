// src/ingest/ingest.controller.ts
import { Controller, HttpCode, Post } from "@nestjs/common";
import { IngestService } from "./ingest.service";

@Controller("ingest")
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  @Post("courses")
  @HttpCode(202) // Accepted
  async trigger() {
    // Simple (blocking) call — swap to await this.ingest.runFullIngest() if you want request to wait
    this.ingest.runFullIngest().catch((e) => console.error(e));
    return { status: "queued (in-process)", task: "courses" };
  }

  @Post("test-elastic")
  @HttpCode(200)
  async testElastic() {
    await this.ingest.runElasticTest();
    return { status: "queued", task: "test-elastic" };
  }
}

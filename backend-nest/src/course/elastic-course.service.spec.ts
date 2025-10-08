import { Test, type TestingModule } from "@nestjs/testing";
import { ElasticCourseService } from "./elastic-course.service";

describe("ElasticCourseService", () => {
  let service: ElasticCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElasticCourseService],
    }).compile();

    service = module.get<ElasticCourseService>(ElasticCourseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CourseModule } from "./course/course.module";
import { DrizzleModule } from "./database/drizzle.module";
import { HealthModule } from "./health/health.module";
import { IngestModule } from "./ingest/ingest.module";
import { DepartmentsController } from "./search/departments.controller";
import { DepartmentsService } from "./search/departments.service";
import { ElasticSearchModule } from "./search/search.module";
import { SupertokensModule } from "./supertokens/supertokens.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IngestModule,
    HealthModule,
    DrizzleModule,
    ElasticSearchModule,
    UserModule,
    SupertokensModule,
    CourseModule,
  ],
  controllers: [AppController, DepartmentsController],
  providers: [AppService, DepartmentsService],
})
export class AppModule {}

// biome-ignore-all lint: Suppress all lint errors

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SuperTokensExceptionFilter } from "supertokens-nestjs";
import supertokens from "supertokens-node";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS must include SuperTokens’ headers and allow credentials
  app.enableCors({
    origin: [
      configService.get<string>("WEBSITE_DOMAIN") ?? "http://localhost:3000",
    ],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SuperTokensExceptionFilter());

  await app.listen(configService.get<number>("PORT") ?? 3000);
}
bootstrap();

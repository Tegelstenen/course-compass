import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { DRIZZLE } from "src/database/drizzle.module";
import * as schema from "../../../types/database/schema";
import { SelectUser } from "../../../types/database/schema";

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async createNewUser(id: string, email: string, name: string): Promise<void> {
    const users = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    const user = users[0];

    if (!user) {
      await this.db.insert(schema.users).values({
        id,
        email,
        name,
      });
    }
  }

  async getUser(id: string): Promise<SelectUser> {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user[0];
  }
}

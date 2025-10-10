import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { DRIZZLE } from "src/database/drizzle.module";
import * as schema from "../../../types/database/schema";
import {
  SelectUser,
  SelectUserFavorites,
} from "../../../types/database/schema";

// Since we can't change the schema to have the userFAvorites, we need to define a new type,
// that includes the userFavorites property.
export type UserWithFavorites = SelectUser & {
  userFavorites: SelectUserFavorites[];
};

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

  async getUserFavorites(userId: string): Promise<SelectUserFavorites[]> {
    const userFavorites = await this.db
      .select()
      .from(schema.user_favorites)
      .where(eq(schema.user_favorites.userId, userId));
    return userFavorites;
  }

  async getUser(id: string): Promise<UserWithFavorites | undefined> {
    const users = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    const user = users[0];

    if (!user) {
      return undefined;
    }
    const userFavorites = await this.getUserFavorites(id);
    console.log("User favs:", userFavorites);

    // Appends the user object with the user favorites, fetched from the separate junction table (above)
    return {
      ...user,
      userFavorites: userFavorites,
    } as UserWithFavorites;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db
      .delete(schema.user_favorites)
      .where(eq(schema.user_favorites.userId, id));
  
    await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id));
  }

}

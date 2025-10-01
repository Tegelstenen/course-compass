CREATE TYPE "public"."course_state" AS ENUM('CANCELLED', 'ESTABLISHED', 'DEACTIVATED');--> statement-breakpoint
CREATE TABLE "courses" (
	"code" text PRIMARY KEY NOT NULL,
	"department" text NOT NULL,
	"name" text NOT NULL,
	"state" "course_state" NOT NULL,
	"last_examination_semester" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "user_favorites" (
	"user_id" text NOT NULL, 
	"fav_course_code" text NOT NULL,

	PRIMARY KEY ("user_id", "fav_course_code"),
    
    CONSTRAINT fk_user 
        FOREIGN KEY ("user_id") 
        REFERENCES "users" ("id") 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_course 
        FOREIGN KEY ("fav_course_code")
        REFERENCES "courses" ("code") 
        ON DELETE CASCADE
);

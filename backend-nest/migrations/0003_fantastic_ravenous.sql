CREATE TABLE "user_favorites" (
	"user_id" text NOT NULL,
	"fav_course_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorites_user_id_fav_course_code_pk" PRIMARY KEY("user_id","fav_course_code")
);
--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_fav_course_code_courses_code_fk" FOREIGN KEY ("fav_course_code") REFERENCES "public"."courses"("code") ON DELETE cascade ON UPDATE no action;
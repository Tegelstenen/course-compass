CREATE TABLE "courses" (
	"code" text PRIMARY KEY NOT NULL,
	"department" text NOT NULL,
	"name" text NOT NULL,
	"state" "course_state" NOT NULL,
	"last_examination_semester" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

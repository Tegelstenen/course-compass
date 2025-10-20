import { z } from "zod";

export const CourseState = z.enum(["CANCELLED", "ESTABLISHED", "DEACTIVATED"]);
export const CourseSchema = z.object({
  department: z.string(),
  code: z.string(),
  name: z.string(),
  state: CourseState,
  last_examination_semester: z.string().optional(),
});
export const CoursesSchema = z.array(CourseSchema);

/** lang + html helpers */
const Lang = z.union([z.enum(["sv", "en"]), z.string()]);

/** "#text" can be missing, null, or non-string; coerce to string ("" by default) */
const CoercedText = z.preprocess((v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return ""; // avoid "[object Object]"
}, z.string());

/** Allow extra props just in case (passthrough), and make attrs optional */
const HtmlBlockLoose = z
  .object({
    "#text": CoercedText, // <- tolerant
    "@_xml:lang": Lang.optional(),
    "@_xmlns": z.string().optional(),
  })
  .catchall(z.unknown());

/** Accept object | object[] | string | null/undefined → normalize to HtmlBlockLoose[] */
const oneOrManyLoose = z
  .union([
    z.array(HtmlBlockLoose),
    HtmlBlockLoose,
    z.string(),
    z.null(),
    z.undefined(),
  ])
  .transform((v) => {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    if (typeof v === "string") return [{ "#text": v }];
    return [v];
  });

/** tiny text nodes (allow missing @, keep date check for lastChanged) */
const TextNode = z
  .object({
    "#text": z.string(),
    "@_xmlns": z.string().optional(),
  })
  .catchall(z.unknown());

export const CoursePlanSchema = z.object({
  "?xml": z.object({
    "@_version": z.number(),
    "@_encoding": z.string(),
  }),
  coursePlan: z.object({
    goals: oneOrManyLoose,
    content: oneOrManyLoose,
    examinationComments: oneOrManyLoose,

    lastChanged: TextNode.extend({
      "#text": z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD date"),
    }),
    lastChangedBy: TextNode,

    "@_courseCode": z.string(),
    "@_validFromTerm": z.number().int(),
    "@_edition": z.number().int(),
    "@_xmlns": z.string().optional(),
  }),
});

export type Document = {
  course_name: string;
  course_code: string;
  department: string;
  state: "CANCELLED" | "ESTABLISHED" | "DEACTIVATED";
  goals: string;
  content: string;
};

export type InsertRequest = {
  index: {
    _index: string;
  };
  document: Document;
};

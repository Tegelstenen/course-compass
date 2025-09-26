Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursePlanSchema =
  exports.CoursesSchema =
  exports.CourseSchema =
  exports.CourseState =
    void 0;
const zod_1 = require("zod");
exports.CourseState = zod_1.z.enum(["CANCELLED", "ESTABLISHED", "DEACTIVATED"]);
exports.CourseSchema = zod_1.z.object({
  department: zod_1.z.string(),
  code: zod_1.z.string(),
  name: zod_1.z.string(),
  state: exports.CourseState,
  last_examination_semester: zod_1.z.string().optional(),
});
exports.CoursesSchema = zod_1.z.array(exports.CourseSchema);
const Lang = zod_1.z.union([zod_1.z.enum(["sv", "en"]), zod_1.z.string()]);
const CoercedText = zod_1.z.preprocess((v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}, zod_1.z.string());
const HtmlBlockLoose = zod_1.z
  .object({
    "#text": CoercedText,
    "@_xml:lang": Lang.optional(),
    "@_xmlns": zod_1.z.string().optional(),
  })
  .catchall(zod_1.z.unknown());
const oneOrManyLoose = zod_1.z
  .union([
    zod_1.z.array(HtmlBlockLoose),
    HtmlBlockLoose,
    zod_1.z.string(),
    zod_1.z.null(),
    zod_1.z.undefined(),
  ])
  .transform((v) => {
    if (Array.isArray(v)) return v;
    if (v == null) return [];
    if (typeof v === "string") return [{ "#text": v }];
    return [v];
  });
const TextNode = zod_1.z
  .object({
    "#text": zod_1.z.string(),
    "@_xmlns": zod_1.z.string().optional(),
  })
  .catchall(zod_1.z.unknown());
exports.CoursePlanSchema = zod_1.z.object({
  "?xml": zod_1.z.object({
    "@_version": zod_1.z.number(),
    "@_encoding": zod_1.z.string(),
  }),
  coursePlan: zod_1.z.object({
    goals: oneOrManyLoose,
    content: oneOrManyLoose,
    examinationComments: oneOrManyLoose,
    lastChanged: TextNode.extend({
      "#text": zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD date"),
    }),
    lastChangedBy: TextNode,
    "@_courseCode": zod_1.z.string(),
    "@_validFromTerm": zod_1.z.number().int(),
    "@_edition": zod_1.z.number().int(),
    "@_xmlns": zod_1.z.string().optional(),
  }),
});
//# sourceMappingURL=schemas.js.map

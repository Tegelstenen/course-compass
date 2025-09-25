import { z } from "zod";
export declare const CourseState: z.ZodEnum<{
  CANCELLED: "CANCELLED";
  ESTABLISHED: "ESTABLISHED";
  DEACTIVATED: "DEACTIVATED";
}>;
export declare const CourseSchema: z.ZodObject<
  {
    department: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    state: z.ZodEnum<{
      CANCELLED: "CANCELLED";
      ESTABLISHED: "ESTABLISHED";
      DEACTIVATED: "DEACTIVATED";
    }>;
    last_examination_semester: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const CoursesSchema: z.ZodArray<
  z.ZodObject<
    {
      department: z.ZodString;
      code: z.ZodString;
      name: z.ZodString;
      state: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        ESTABLISHED: "ESTABLISHED";
        DEACTIVATED: "DEACTIVATED";
      }>;
      last_examination_semester: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
  >
>;
export declare const CoursePlanSchema: z.ZodObject<
  {
    "?xml": z.ZodObject<
      {
        "@_version": z.ZodNumber;
        "@_encoding": z.ZodString;
      },
      z.core.$strip
    >;
    coursePlan: z.ZodObject<
      {
        goals: z.ZodPipe<
          z.ZodUnion<
            readonly [
              z.ZodArray<
                z.ZodObject<
                  {
                    "#text": z.ZodPipe<
                      z.ZodTransform<string, unknown>,
                      z.ZodString
                    >;
                    "@_xml:lang": z.ZodOptional<
                      z.ZodUnion<
                        readonly [
                          z.ZodEnum<{
                            sv: "sv";
                            en: "en";
                          }>,
                          z.ZodString,
                        ]
                      >
                    >;
                    "@_xmlns": z.ZodOptional<z.ZodString>;
                  },
                  z.core.$catchall<z.ZodUnknown>
                >
              >,
              z.ZodObject<
                {
                  "#text": z.ZodPipe<
                    z.ZodTransform<string, unknown>,
                    z.ZodString
                  >;
                  "@_xml:lang": z.ZodOptional<
                    z.ZodUnion<
                      readonly [
                        z.ZodEnum<{
                          sv: "sv";
                          en: "en";
                        }>,
                        z.ZodString,
                      ]
                    >
                  >;
                  "@_xmlns": z.ZodOptional<z.ZodString>;
                },
                z.core.$catchall<z.ZodUnknown>
              >,
              z.ZodString,
              z.ZodNull,
              z.ZodUndefined,
            ]
          >,
          z.ZodTransform<
            {
              [x: string]: unknown;
              "#text": string;
              "@_xml:lang"?: string | undefined;
              "@_xmlns"?: string | undefined;
            }[],
            | string
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }[]
            | null
            | undefined
          >
        >;
        content: z.ZodPipe<
          z.ZodUnion<
            readonly [
              z.ZodArray<
                z.ZodObject<
                  {
                    "#text": z.ZodPipe<
                      z.ZodTransform<string, unknown>,
                      z.ZodString
                    >;
                    "@_xml:lang": z.ZodOptional<
                      z.ZodUnion<
                        readonly [
                          z.ZodEnum<{
                            sv: "sv";
                            en: "en";
                          }>,
                          z.ZodString,
                        ]
                      >
                    >;
                    "@_xmlns": z.ZodOptional<z.ZodString>;
                  },
                  z.core.$catchall<z.ZodUnknown>
                >
              >,
              z.ZodObject<
                {
                  "#text": z.ZodPipe<
                    z.ZodTransform<string, unknown>,
                    z.ZodString
                  >;
                  "@_xml:lang": z.ZodOptional<
                    z.ZodUnion<
                      readonly [
                        z.ZodEnum<{
                          sv: "sv";
                          en: "en";
                        }>,
                        z.ZodString,
                      ]
                    >
                  >;
                  "@_xmlns": z.ZodOptional<z.ZodString>;
                },
                z.core.$catchall<z.ZodUnknown>
              >,
              z.ZodString,
              z.ZodNull,
              z.ZodUndefined,
            ]
          >,
          z.ZodTransform<
            {
              [x: string]: unknown;
              "#text": string;
              "@_xml:lang"?: string | undefined;
              "@_xmlns"?: string | undefined;
            }[],
            | string
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }[]
            | null
            | undefined
          >
        >;
        examinationComments: z.ZodPipe<
          z.ZodUnion<
            readonly [
              z.ZodArray<
                z.ZodObject<
                  {
                    "#text": z.ZodPipe<
                      z.ZodTransform<string, unknown>,
                      z.ZodString
                    >;
                    "@_xml:lang": z.ZodOptional<
                      z.ZodUnion<
                        readonly [
                          z.ZodEnum<{
                            sv: "sv";
                            en: "en";
                          }>,
                          z.ZodString,
                        ]
                      >
                    >;
                    "@_xmlns": z.ZodOptional<z.ZodString>;
                  },
                  z.core.$catchall<z.ZodUnknown>
                >
              >,
              z.ZodObject<
                {
                  "#text": z.ZodPipe<
                    z.ZodTransform<string, unknown>,
                    z.ZodString
                  >;
                  "@_xml:lang": z.ZodOptional<
                    z.ZodUnion<
                      readonly [
                        z.ZodEnum<{
                          sv: "sv";
                          en: "en";
                        }>,
                        z.ZodString,
                      ]
                    >
                  >;
                  "@_xmlns": z.ZodOptional<z.ZodString>;
                },
                z.core.$catchall<z.ZodUnknown>
              >,
              z.ZodString,
              z.ZodNull,
              z.ZodUndefined,
            ]
          >,
          z.ZodTransform<
            {
              [x: string]: unknown;
              "#text": string;
              "@_xml:lang"?: string | undefined;
              "@_xmlns"?: string | undefined;
            }[],
            | string
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }
            | {
                [x: string]: unknown;
                "#text": string;
                "@_xml:lang"?: string | undefined;
                "@_xmlns"?: string | undefined;
              }[]
            | null
            | undefined
          >
        >;
        lastChanged: z.ZodObject<
          {
            "@_xmlns": z.ZodOptional<z.ZodString>;
            "#text": z.ZodString;
          },
          z.core.$catchall<z.ZodUnknown>
        >;
        lastChangedBy: z.ZodObject<
          {
            "#text": z.ZodString;
            "@_xmlns": z.ZodOptional<z.ZodString>;
          },
          z.core.$catchall<z.ZodUnknown>
        >;
        "@_courseCode": z.ZodString;
        "@_validFromTerm": z.ZodNumber;
        "@_edition": z.ZodNumber;
        "@_xmlns": z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
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

import { z } from "zod";

const deleteStudentSchema = z.object({
    id: z
        .string()
        .min(1, "Student id is required")
        .regex(/^\d+$/, "Invalid student id"),
});

export default deleteStudentSchema;

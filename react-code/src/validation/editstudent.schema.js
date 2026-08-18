import { z } from "zod";

const editStudentSchema = z.object({
    name: z
        .string()
        .min(2, "Full name too short")
        .max(50, "Full name too long")
        .regex(/^[A-Za-z\s'-]+$/, "Invalid full name"),

    age: z
        .string()
        .min(1, "Age is required")
        .regex(/^\d+$/, "Age must be a number"),

    email: z
        .string()
        .email("Invalid email format")
        .max(255),

    branchId: z
        .string()
        .min(1, "Branch is required"),
});

export default editStudentSchema;

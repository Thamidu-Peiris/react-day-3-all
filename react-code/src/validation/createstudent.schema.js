import { z } from "zod";

const createStudentSchema = z.object({
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

    phone: z
        .string()
        .min(10, "Phone number too short")
        .max(15, "Phone number too long")
        .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),

    course: z
        .string()
        .max(100, "Course name too long")
        .optional(),

    branchId: z
        .string()
        .min(1, "Branch is required"),
});

export default createStudentSchema;

import { z } from "zod"

const createStudentSchema = z.object({
    name: z
        .string()
        .min(2, "Full name too short")
        .max(100, "Full name too long")
        .regex(/^[A-Za-z\s'-]+$/, "Invalid full name"),

    email: z
        .string()
        .email("Invalid email format")
        .max(255),

    age: z
        .number()
        .int("Age must be a whole number")
        .min(16, "Age must be at least 16")
        .max(100, "Age must be at most 100"),

    phone: z
        .string()
        .min(10, "Phone number too short")
        .max(20, "Phone number too long")
        .regex(/^[\d\s+()-]+$/, "Invalid phone number"),

    course: z
        .string()
        .max(100, "Course name too long")
        .optional(),

    branchId: z
        .string()
        .min(1, "Branch is required"),
})

export default createStudentSchema

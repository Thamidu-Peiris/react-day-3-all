import { z } from "zod"

const editBranchSchema = z.object({
    name: z
        .string()
        .min(2, "Branch name too short")
        .max(100, "Branch name too long"),

    city: z
        .string()
        .min(2, "City name too short")
        .max(100, "City name too long"),

    studentCount: z
        .number()
        .int("Student count must be a whole number")
        .min(0, "Student count cannot be negative"),

    activeCount: z
        .number()
        .int("Active count must be a whole number")
        .min(0, "Active count cannot be negative"),

    manager: z
        .string()
        .min(2, "Manager name too short")
        .max(100, "Manager name too long"),

    status: z
        .enum(["active", "inactive"], { message: "Invalid status" }),
})

export default editBranchSchema

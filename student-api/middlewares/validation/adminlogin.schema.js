import { z } from "zod"

const adminLoginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .max(255),

    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
})

export default adminLoginSchema

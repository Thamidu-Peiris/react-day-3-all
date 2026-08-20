import { z } from "zod"

const deleteBranchSchema = z.object({
    id: z
        .string()
        .min(1, "Branch id is required"),
})

export default deleteBranchSchema

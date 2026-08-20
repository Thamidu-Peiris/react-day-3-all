import { prisma } from "../lib/prisma.js";

const formatBranch = (branch) => ({
    id: branch.id,
    name: branch.name,
    city: branch.city,
    studentCount: branch.studentCount,
    activeCount: branch.activeCount,
    manager: branch.manager,
    status: branch.status,
})

export const CreateBranch = async (req, res) => {
    try {
        const { id, name, city, studentCount, activeCount, manager, status } = req.body;

        const existing = await prisma.branch.findUnique({
            where: { id },
        })

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Branch id already exists",
                errors: { id: "Branch id already exists" },
            })
        }

        const branch = await prisma.branch.create({
            data: {
                id,
                name,
                city,
                studentCount,
                activeCount,
                manager,
                status,
            },
        })

        return res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: formatBranch(branch),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const GetBranches = async (req, res) => {
    try {
        const { id } = req.params

        if (id) {
            const branch = await prisma.branch.findUnique({
                where: { id },
            })

            if (!branch) {
                return res.status(404).json({
                    success: false,
                    message: "Branch not found",
                })
            }

            return res.status(200).json({
                success: true,
                message: "Branch fetched successfully",
                data: formatBranch(branch),
            })
        }

        const branches = await prisma.branch.findMany({
            orderBy: { id: "asc" },
        })

        return res.status(200).json({
            success: true,
            message: "Branches fetched successfully",
            data: branches.map(formatBranch),
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const UpdateBranch = async (req, res) => {
    try {
        const { id } = req.params
        const { name, city, studentCount, activeCount, manager, status } = req.body

        const branch = await prisma.branch.update({
            where: { id },
            data: {
                name,
                city,
                studentCount,
                activeCount,
                manager,
                status,
            },
        })

        return res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: formatBranch(branch),
        })

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const DeleteBranch = async (req, res) => {
    try {
        const { id } = req.params

        await prisma.branch.delete({
            where: { id },
        })

        return res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        })

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

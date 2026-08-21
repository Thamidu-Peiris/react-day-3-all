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
        const { name, city, manager, status, studentCount, activeCount } = req.body;

        const existName = await prisma.branch.findFirst({
            where: {
                name: name
            }
        })

        if (existName) {
            return res.status(400).json({
                success: false,
                message: "branch name already exists"
            })
        }

        const count = await prisma.branch.count()
        const id = `b${count + 1}`

        const existId = await prisma.branch.findFirst({
            where: {
                id: id
            }
        })

        if (existId) {
            return res.status(400).json({
                success: false,
                message: "branch id already exists"
            })
        }

        await prisma.branch.create({
            data: {
                id,
                name,
                city,
                manager,
                status,
                studentCount,
                activeCount,
            }
        })

        return res.status(201).json({
            success: true,
            message: "branch created successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!"
        })
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
            orderBy: { id: "desc" },
        })

        return res.status(200).json({
            success: true,
            message: "branches fetched successfully",
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
        const { name, city, manager, status, studentCount, activeCount } = req.body

        if (!id) {
            return res.json({ msg: "invalid type" })
        }

        const exist = await prisma.branch.findFirst({
            where: {
                id: id
            }
        })

        if (!exist) {
            return res.status(409).json({
                success: false,
                message: "branch id not found",
            })
        }

        const existName = await prisma.branch.findFirst({
            where: {
                name: name,
                NOT: { id: id }
            }
        })

        if (existName) {
            return res.status(400).json({
                success: false,
                message: "branch name already exists"
            })
        }

        const data = await prisma.branch.update({
            where: { id: id },
            data: {
                name,
                city,
                manager,
                status,
                studentCount,
                activeCount,
            },
        })

        return res.status(200).json({
            success: true,
            message: "branch updated successfully",
            data: formatBranch(data)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!"
        })
    }
}


export const DeleteBranch = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.json({ msg: "invalid type" })
        }

        const exist = await prisma.branch.findFirst({
            where: {
                id: id
            }
        })

        if (!exist) {
            return res.status(409).json({
                success: false,
                message: "Branch id not found",
            })
        }

        await prisma.branch.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({
            success: true,
            message: "branch deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!"
        })
    }
}
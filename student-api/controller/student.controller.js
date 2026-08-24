import { prisma } from "../lib/prisma.js";


const formatStudent = (student, overrides = {}) => ({
    id: student.id,
    name: student.full_name,
    email: student.email,
    phone: student.phone,
    course: student.course,
    branchId: student.branchId,
    branch: overrides.branch?.name ?? student.branch?.name ?? "Not Found",
    age: student.age,
    avatar: student.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    status: overrides.status ?? student.status ?? "active",
    paymentStatus: overrides.paymentStatus ?? student.paymentStatus ?? "pending",
enrollDate: new Date(student.createdAt).toLocaleDateString("en-LK",{
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: '2-digit',
        minute:"2-digit",
        hour12:false
    }) ?? "-",
})


export const CreateStudent = async (req, res) => {
    try {
        const { id, name, age, email, phone, course, branchId } = req.body;

        const existingStudents = await prisma.student.findMany({
            where: {
                OR: [
                    { email },
                    { phone },
                ],
            },
            select: {
                email: true,
                phone: true,
            },
        })

        const errors = {}

        if (existingStudents.some((student) => student.email == email)) {
            errors.email = "email already exists"
        }

        if (existingStudents.some((student) => student.phone == phone)) {
            errors.phone = "phone number already exists"
        }

        if (Object.keys(errors).length > 0) {
            return res.status(409).json({
                success: false,
                message: Object.values(errors).join(", "),
                errors,
            })
        }

        const branch = await prisma.branch.findFirst({
            where: {
                id: branchId
            }
        })

        if (!branch){
            return res.status(404).json({
                success: false,
                message: "branch not found",
            })
        }

        if ( branch.status != 'active'){
            return res.status(400).json({
                success: false,
                message: "branch is not active"

            })
        }

        await prisma.student.create({
            data:{
                full_name: name,
                age,
                email,
                phone,
                course: course || "General",
                branchId: branchId
            }
        })

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
        })

    } catch (error) {
        console.error(error);

        if (error.code == "P2002") {
            return res.status(409).json({
                success: false,
                message: "Phone number already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



export const GetStudents = async (req, res) => {
    try {
        const { id } = req.params

        if (id) {
            const student = await prisma.student.findUnique({
                where: { id: parseInt(id) },
                include: { branch: true },
            })

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                })
            }

            return res.status(200).json({
                success: true,
                message: "Student fetched successfully",
                data: formatStudent(student),
            })
        }

        const students = await prisma.student.findMany({
            orderBy: { id: "desc" },
            include: { branch: true },
        })

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: students.map(formatStudent),
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


export const UpdateStudent = async (req, res) => {
    try {
        const { id } = req.params
        const { name, age, email, course, status, paymentStatus, branchId } = req.body

        if (!parseInt(id)) {
            return res.json({ msg: "invalid type" })
        }

        const exist = await prisma.student.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        if (!exist) {
            return res.status(409).json({
                success: false,
                message: "student id not found",
            })
        }

        const existEmail = await prisma.student.findFirst({
            where: {
                email: email,
                NOT: { id: parseInt(id) }
            }
        })

        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: "email already exists"
            })
        }

        const data = await prisma.student.update({
            where: { id: Number(req.params.id) },
            data: {
                full_name: name,
                age,
                email,
                course: course || "General",
                branchId: branchId,
            },
            include: { branch: true },
        })

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: formatStudent(data, {
                status,
                paymentStatus,
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!"
        })
    }
}


export const DeleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!parseInt(id)) {
            return res.json({ msg: "invalid type" })
        }

        const exist = await prisma.student.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        if (!exist) {
            return res.status(409).json({
                success: false,
                message: "Student id not found",
            })
        }

        await prisma.student.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!"
        })
    }
}
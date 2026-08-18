import { prisma } from "../lib/prisma.js";

const BRANCH_NAMES = {
    b1: "Downtown Campus",
    b2: "Westside Center",
    b3: "Northgate Branch",
    b4: "Eastpark Hub",
    b5: "Southside Studio",
    b6: "Harbor View",
};

const formatStudent = (student) => ({
    id: student.id,
    name: student.full_name,
    age: student.age,
    email: student.email || "",
    phone: student.phone,
    course: student.course || "General",
    branchId: student.Branch,
    branch: BRANCH_NAMES[student.Branch] || student.Branch,
    avatar: student.full_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    status: student.status || "active",
    paymentStatus: student.paymentStatus || "pending",
    enrollDate: student.enrollDate || new Date().toISOString().split("T")[0],
});

export const CreateStudent = async (req, res) => {
    try {
        const { name, age, email, phone, course, branchId } = req.body;

        const student = await prisma.student.create({
            data: {
                full_name: name,
                age: parseInt(age),
                email,
                phone,
                course,
                Branch: branchId,
                enrollDate: new Date().toISOString().split("T")[0],
                paymentStatus: "pending",
            },
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: formatStudent(student),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const GetStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: {
                id: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: students.map((student) => formatStudent(student)),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const EditStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, email, branchId, status, paymentStatus, enrollDate } = req.body;

        const existingStudent = await prisma.student.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const student = await prisma.student.update({
            where: {
                id: parseInt(id),
            },
            data: {
                full_name: name,
                age: parseInt(age),
                email,
                Branch: branchId,
                status: status || existingStudent.status,
                paymentStatus: paymentStatus || existingStudent.paymentStatus,
                enrollDate: enrollDate || existingStudent.enrollDate,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: formatStudent(student),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const DeleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const existingStudent = await prisma.student.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        await prisma.student.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

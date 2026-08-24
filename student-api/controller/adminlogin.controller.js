import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "invalid type",
            })
        }

        if (!email.trim() || !password.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            })
        }

        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (!admin || !admin.password) {
            return res.status(404).json({
                success: false,
                message: "Email or password invalid",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Email or password invalid",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login success",
            data: {
                id: admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!",
        });
    }
};
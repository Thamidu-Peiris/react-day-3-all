import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

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

        const accessToken = generateAccessToken(admin.id, admin.firstname,admin.email);
        const refreshToken = generateRefreshToken(admin.id);

        res.cookie('refreshtoken', refreshToken,{
            httpOnly:true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7*24*60*1000,
    })

        

        return res.status(200).json({
            success: true,
            message: "Login success",
            accessToken:accessToken,
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
import { ErrorHandler } from "./Errorhandler.js"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"


export const ProtectRoute = async (req,res,next) => {
    try {

        const authHeader = req.headers['authorization']

        if(!authHeader){
            return res.status(401).json({
                sucess:false,
                Unauthorized: "Unauthorized - No Token",
            })
        }

        const token = authHeader&&authHeader.startsWith("Bearer")? authHeader.split("=")[1]:false

        if(!token){
            return res.status(401).json({
                sucess:false,
                Unauthorized:"Unauthorized - No Token",
            })
        }


        let decode = jwt.verify(token,process.env.JWT_SECRET);

        let id = decode.id;

        const data = await prisma.admin.findUnique({
            where:{id:parseInt(id)}

        })


        if(!data){
            return res.status(401).json({
                sucess:false,
                Unauthorized:"Unauthorized",
            })
        }

        const userdata = {
            id:data.id,
            firstname:data.firstname,
            lastname:data.lastname,
            email:data.email
        }




        console.log(decode)

        next()
        
    } catch (error) {

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                message:"Token Expired",
                code:"TOKEN_EXPIRED",
            })
        }
        
        return res.status(401).json({
            sucess:false,
            Unauthorized:"Unauthorized - Invalid Token",
        })
        
        
    }
}
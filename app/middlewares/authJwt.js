import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;  

export const verifyToken = async (req, res, next) => {
    
    //parte cambiada para que funcione con el token de la cabecera o el token de la url
    const token = req.headers["authorization"]?.replace("Bearer ", "") || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({ message: "No se proporciono un token!" });
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ",""),
            authConfig.secret
        ); 
        req.userId = decoded.id;

        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(401).json({ message: "No autorizado!" });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: "No autorizado!" });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        const adminRole = roles.find(role => role.name === "admin");

        if (adminRole) {
            next();
            return;
        }
        res.status(403).json({ message: "Requiere el rol de administrador!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        const modRole = roles.find(role => role.name === "moderator");

        if (modRole) {
            next();
            return;
        }

        res.status(403).json({ message: "Requiere el rol de moderador!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 export const isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        const hasRole = roles.some((role) => ["admin", "moderator"].includes(role.name));

        if (hasRole) {
            next();
            return;
        }
        res.status(403).json({ message: "Requiere el rol de moderador o administrador!" });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};




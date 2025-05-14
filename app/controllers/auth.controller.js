import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config.js';

const { user: User, role: Role } = db;

export const signup = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (roles && roles.length > 0) {
            const foundRoles = await Role.findAll({
                where: {
                    name: roles,
                },
            });
            await user.setRoles(foundRoles);
        } else {
            const defaultRole = await Role.findOne({ where: { name: 'user' } });
            await user.setRoles([defaultRole]);
        }

        res.status(201).json({ message: "Usuario registrado exitosamente!" });
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Datos recibidos:', username, password);

        const user = await User.findOne({
            where: { username },
        });

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            console.log('Contraseña inválida');
            return res.status(401).send({
                accessToken: null,
                message: 'Contraseña inválida.',
            });
        }

        //esto tiene como funcion firmar el token y enviarlo al cliente 
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,
        });

        const roles = await user.getRoles();
        const roleNames = roles.map((role) => `ROLE_${role.name.toUpperCase()}`);
        console.log('Roles del usuario:', roleNames);

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: roleNames,
            accessToken: token,
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.message);
        res.status(500).send({ message: error.message });
    }
};
import db from '../models/index.js';
const User = db.user;
const Role = db.role;

export const allAccess = (req, res) => {
    res.status(200).send("Contenido público.");
};

export const userBoard = (req, res) => {
    res.status(200).send("Contenido para usuarios.");
};

export const adminBoard = (req, res) => {
    res.status(200).send("Contenido para administradores.");
};

export const moderatorBoard = (req, res) => {
    res.status(200).send("Contenido para moderadores.");
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] }
      }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};
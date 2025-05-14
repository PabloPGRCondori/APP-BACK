import express from 'express';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';


const app = express();
const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:3001'],
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.json({ message: "Bienvenido a la aplicación de autenticación!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

const PORT = process.env.PORT || 3001;

db.sequelize.sync({ force: false }).then(() => {
    console.log("Base de datos sincronizada!");
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}.`);
    });
});

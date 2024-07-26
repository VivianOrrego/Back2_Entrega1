import {
    Router
} from "express";
import {
    userModel
} from "../models/user.model.js";
import {
    createHash
} from "../utils/hash.js";
import passport from "passport";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router();

router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/login-error",
    }),
    async (req, res) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const payload = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        };

        const token = generateToken(payload);

            res.cookie("currentUser", token, {
            maxAge: 1000000,
            httpOnly: true,
            });

        res.status(200).json({
            message: "Login success",
            token,
        });
    }
);

router.get("/login-error", (req, res) => {
    res.status(401).json({
        error: "Unauthorized",
    });
});



router.post("/register", async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        age,
        role,
        password
    } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({
            error: "Missing fields",
        });
    }

    try {
        // Hashear contraseña
        const hashPassword = await createHash(password);

        const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword,
            role,
        });

        res.status(201).json(user);
    } catch (error) {
        res
            .status(500)
            .json({
                error: "Error al crear el usuario",
                details: error.message
            });
    }
});


router.get("/current", authenticate ,async (req, res) => {
    const token = req.cookies.currentUser;
    console.log(token);

    if (!token) {
    return res.status(401).json({ error: "No autorizado" });
    }

    try {
    const user = verifyToken(token);

    const userDB = await userModel.findOne({ email: user.email });

    if (!userDB) {
        return res.status(404).json({ error: "No se encontró el usuario" });
    }

    res.status(200).json(userDB);
    } catch (error) {
    res
        .status(500)
        .json({ error: "Error al obtener el usuario", details: error.message });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.status(200).json({ message: "Sesión cerrada" });
});

export default router;
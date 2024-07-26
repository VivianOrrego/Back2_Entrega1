import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import sessionRoutes from "./routes/session.routes.js";
import userRoutes from "./routes/user.routes.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import  {initializePassport}  from "./config/passport.config.js";
import passport from "passport";

const app = express();
const PORT = 8080;

// Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));

// Passport config
initializePassport();
app.use(passport.initialize());


// Mongo config
mongoose
    .connect("mongodb+srv://ViviOrrego:CoderHause@cluster0.moxbuih.mongodb.net/entrega1")
    .then(() => {
    console.log("Conectado a MongoDB");
})
.catch((error) => {
    console.log(error);
});

// Routes
app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes); // Toda la ruta protegida

// Start server
app.listen(PORT, () => {
console.log(`Server is running on port http://localhost:${PORT}`);
});
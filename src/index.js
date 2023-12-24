import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";

//Passport
import passport from "passport";
import { createHash, isValidPassword } from "./utils.js";
import initializePassport from "./config/passport.config.js";


//Mongoose
import mongoose from "mongoose";

//Rutas
import ViewsRouter from "./router/views.routes.js";
import cartsRouter from "./router/carts.routes.js";
import productsRouter from "./router/products.routes.js";
import UserRouter from "./router/user.routes.js";


//Creación de la aplicación Express y servidor HTTP:
const app = express()
const PORT = 8080;
app.listen(PORT, () => console.log(`Escuchando servidor en puerto ${PORT}`))

const fileStorage = FileStore(session);

//Conexión a MongoDB:
mongoose.set('strictQuery', false); //Para que no de error deprecated al buscar por query
mongoose.connect( "mongodb+srv://beatriz1712sc:soynuevabasededatos@cluster0.2gm0bzy.mongodb.net/test", (error) => {
    if (error) {
        console.log("Error connecting to database: ", error);
        process.exit();
    }
    console.log("Connected to database");
})

//Configuración de sesión:
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://beatriz1712sc:soynuevabasededatos@cluster0.2gm0bzy.mongodb.net/test",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 600
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}))

//Configuración de passport:
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Estructura handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Configuración de rutas estáticas y de vistas:
app.use("/", express.static(__dirname + "/public"))

//Rutas para vistas:
app.use("/", ViewsRouter)

//Rutas para CRUD:
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/api/users", UserRouter)









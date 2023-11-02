import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";
import chalk from "chalk";
//Passport
import passport from "passport";
import { createHash, isValidPassword } from "./utils.js";
import initializePassport from "./config/passport.config.js";

//Mongoose
import mongoose from "mongoose";

//Rutas
import ViewsRouter from "./routes/views.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import UserRouter from "./routes/user.routes.js";

//Creación de la aplicación Express y servidor HTTP:
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
  console.log(chalk.bgYellowBright.black.bold(`Escuchando en puerto: ${PORT}`));
});

const fileStorage = FileStore(session);

//Conexión a MongoDB:
mongoose;
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://beatriz1712sc:soynuevabasededatos@cluster0.2gm0bzy.mongodb.net/test"
  )
  .then(() => {
    console.log("\u001b[1;36mConectada a la base de datos");
  })
  .catch((error) =>
    console.error("\u001b[1;36mError al conectar a la base de datos", error)
  );

//Configuración de sesión:
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://beatriz1712sc:soynuevabasededatos@cluster0.2gm0bzy.mongodb.net/test",
      ttl: 3600,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Configuración de passport:
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Estructura handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//Configuración de rutas estáticas y de vistas:
app.use("/", express.static(__dirname + "/public"));

//Rutas para vistas:
app.use("/", ViewsRouter);

//Rutas para CRUD:
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", UserRouter);

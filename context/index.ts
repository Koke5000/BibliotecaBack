import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

import routerUsuarios from "./usuarios/infrastructure/rest/Usuario.Router";
import routerLibros from "./libros/infrastructure/rest/Libro.Router";
app.use("/api/usuarios", routerUsuarios);
app.use("/api/libros", routerLibros);

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});

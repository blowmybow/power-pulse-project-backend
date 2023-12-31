const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const exercisesRouter = require("./routes/api/exercises");
const authRouter = require("./routes/api/auth");
const usersRouter = require("./routes/api/users");
const productsRouter = require("./routes/api/products");
const statisticsRouter = require("./routes/api/statistics");
const productsDiaryRouter = require("./routes/api/productsDiary");
const exerciseDiaryRouter = require("./routes/api/exercisesDiary");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/exercises", exercisesRouter);
app.use("/products", productsRouter);
app.use("/statistics", statisticsRouter);
app.use("/products_diary", productsDiaryRouter);
app.use("/exercise_diary", exerciseDiaryRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

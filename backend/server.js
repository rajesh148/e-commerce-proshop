import express, { urlencoded } from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRouter.js";
import userRoutes from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import "colors";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlewar.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

//connect to the database
connectDB();
const app = express();

//Body parser Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

//products
app.use("/api/products", productRoutes);

//users
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

//START THE SERVER ON THE PORT
app.listen(PORT, () =>
  console.log(`Server is ready and running on the port number ${PORT}`)
);

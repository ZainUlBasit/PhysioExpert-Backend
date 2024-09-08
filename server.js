const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

// Routes
const AuthRoutes = require("./routes/auth.routes");
const DoctorRoutes = require("./routes/doctor.routes");
const PatientRoutes = require("./routes/patient.routes");
const ProductRoutes = require("./routes/product.routes");
const ProductOrderRoutes = require("./routes/product.order.routes");
const BlogRoutes = require("./routes/blogs.routes");
const ServicesRoutes = require("./routes/service.routes");
const ChatRoutes = require("./routes/chat.routes");
const ContactRoutes = require("./routes/contact.routes");
const AppointmentRoutes = require("./routes/appointment.routes");
const CategoryRoutes = require("./routes/category.routes");
const ExerciseRoutes = require("./routes/exercise.routes");
const StatsRoutes = require("./routes/stats.routes");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT;
const SOCKET_SECRET_KEY = process.env.SOCKET_SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// CORS setup for Express.js
app.use(
  cors({
    origin: "https://physio-experts.vercel.app", // Frontend URL
    credentials: true, // Allow credentials such as cookies
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
    allowedHeaders: ["Authorization", "Content-Type", "secretkey", "token"], // Allowed headers
    exposedHeaders: ["Access-Control-Allow-Origin"], // Exposed headers
  })
);

// Middleware to handle CORS headers for all routes
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://physio-experts.vercel.app"
  ); // Frontend URL
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, secretkey, token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "https://physio-experts.vercel.app", // Frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials
    allowedHeaders: ["Authorization", "Content-Type", "secretkey", "token"], // Allowed headers
    exposedHeaders: ["Access-Control-Allow-Origin"], // Exposed headers
  },
});

app.io = io;
app.set("io", io);
global.io = io;

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Connection established!");

  try {
    const { secretkey, token } = socket.handshake.headers;
    console.log("Received token:", token);

    if (!secretkey || !token) {
      console.log("Missing secret key or token");
      return socket.disconnect();
    }

    const decoded = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = decoded._doc || decoded; // Handle different token structures

    if (secretkey !== SOCKET_SECRET_KEY || !user) {
      console.log("Invalid secret key or token");
      return socket.disconnect();
    }

    switch (user.role) {
      case 1:
        console.log("===============Admin SOCKET JOINED==============");
        socket.join(["/admin-" + user._id]);
        break;
      case 2:
        console.log("===============Doctor SOCKET JOINED==============");
        socket.join(["/doctor-" + user.doctorId._id]);
        break;
      case 3:
        console.log("===============Patient SOCKET JOINED==============");
        socket.join(["/patient-" + user.patientId._id]);
        break;
      default:
        console.log("No other room joined!");
        socket.join(`/visitor`);
        break;
    }
  } catch (error) {
    console.log("SOCKET ERROR");
    console.log(error);
  }
});

// API routes
app.use("/api/auth", AuthRoutes);
app.use("/api/doctor", DoctorRoutes);
app.use("/api/patient", PatientRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/products-order", ProductOrderRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/services", ServicesRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/contacts", ContactRoutes);
app.use("/api/appointment", AppointmentRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/exercise", ExerciseRoutes);
app.use("/api/stats", StatsRoutes);

// 404 and error handling
app.use("*", (req, res) => res.status(404).send("Not Found!"));
app.use((req, res, error) => {
  console.log(error);
  res.status(400).json({ success: false, error });
});

// Start server
server.listen(PORT, (error) => {
  if (error) return console.log("SERVER_CONNECTION ERROR", error);
  console.log("Server connected on ", PORT);
});

module.exports = {
  io: io,
};

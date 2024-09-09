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
const mongooseUrl = process.env.mongooseUrl;

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// CORS configuration for HTTP requests
app.use(
  cors({
    origin: ["http://localhost:5173"], // Frontend domain
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Log requests for debugging
app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Socket.io setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend domain
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    maxHttpBufferSize: 1e6, // Set buffer limit if needed
  },
});

app.io = io;
app.set("io", io);
global.io = io;

// Socket.io connection handling with JWT authentication via socket.auth
io.on("connection", (socket) => {
  console.log("Socket connection established");

  try {
    const token = socket.handshake.auth.token; // JWT token passed via auth
    const user = jwt.verify(token, ACCESS_SECRET_KEY);

    if (!user) return socket.disconnect();

    // Join rooms based on user role
    switch (user.role) {
      case 1:
        console.log("Admin socket joined");
        socket.join(`/admin-${user._id}`);
        break;
      case 2:
        console.log("Doctor socket joined");
        socket.join(`/doctor-${user.doctorId._id}`);
        break;
      case 3:
        console.log("Patient socket joined");
        socket.join(`/patient-${user.patientId._id}`);
        break;
      default:
        console.log("Visitor socket joined");
        socket.join(`/visitor`);
        break;
    }
  } catch (error) {
    console.error("Socket authentication error:", error);
    socket.disconnect();
  }
});

// Routes
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

// 404 route
app.use("*", (req, res) => res.status(404).send("Not Found!"));

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(400).json({ success: false, error });
});

// Start server
server.listen(PORT, (error) => {
  if (error) return console.error("Server connection error:", error);
  console.log(`Server connected on port ${PORT}`);
});

// Export io for external usage
module.exports = {
  io: io,
};

require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8001;
const app = express();
const http = require("http");
const server = http.createServer(app);
// const Router = require("./web/routes");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// ++++++++++++++++++++++++++++++++++++++++++
// Start Import all Routes
// ++++++++++++++++++++++++++++++++++++++++++
const AuthRoutes = require("./routes/auth.routes");
const DoctorRoutes = require("./routes/doctor.routes");
const PatientRoutes = require("./routes/patient.routes");
const ProductRoutes = require("./routes/product.routes");
const ProductOrderRoutes = require("./routes/product.order.routes");
const BlogRoutes = require("./routes/blogs.routes"); // Adjust the path according to your file structure
const ServicesRoutes = require("./routes/service.routes"); // Adjust the path according to your file structure

const { successMessage } = require("./utils/ResponseMessage");

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// End Import all Routes
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

global.rootDirectory = path.resolve(__dirname);

const corsOptions = {
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5176",
    "http://localhost:5177",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", AuthRoutes);
app.use("/api/doctor", DoctorRoutes);
app.use("/api/patient", PatientRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/products-order", ProductOrderRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/services", ServicesRoutes);

const server_app = server.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

app.use(function (req, res, next) {
  console.log(req.originalUrl);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5174",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  const { secretkey, token } = socket.handshake.headers;
  console.log(token);
});

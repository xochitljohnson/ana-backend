// Config
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 5001;
const connectDB = require("./config/db");

// Connect to DB
connectDB();

// Express
const express = require("express");
const cors = require("cors");
const app = express();

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// route files
const notes = require("./api/v1/routes/notes");
const auth = require("./api/v1/routes/auth");
const users = require("./api/v1/routes/users");

app.use(express.json());
let corsOptions = {
  origin: ["http://localhost:1234/", "http://localhost:5500/"],
};

app.options("http://localhost:1234", cors());
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(fileupload());

// Middleware
const morgan = require("morgan");
const errorHandler = require("./api/v1/middlewares/error");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(cors());

// Routes
app.use("/api/v1/notes", notes, cors(corsOptions));
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use(errorHandler);

// Server listen
const server = app.listen(port, console.log(`Server running in ${port}`));

// Handle unhandled promise rejections
// this is a core module of node js calling a native event
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const creatorRoutes = require("./routes/creator.routes");
const viewerRoutes = require("./routes/viewer.routes");
const userRoutes = require("./routes/user.routes");
const userAuthRoutes = require("./routes/userAuth.routes");
const productRoutes = require("./routes/product.routes");
require("./jobs/campaignScheduler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/creator", creatorRoutes);
app.use("/viewer", viewerRoutes);
app.use("/user", userRoutes);
app.use("/userAuth", userAuthRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;

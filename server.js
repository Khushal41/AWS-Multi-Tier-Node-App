const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./app/routes/item.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend

// Routes
app.use("/api", itemRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

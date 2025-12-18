import cors from "cors";
import express from "express";
import { initializeAgentBeats } from "./routes.js";
console.log("Starting server...");
var app = express();
// Configure CORS to allow any connection, method, and header
app.use(cors({
    origin: '*',
}));
// Add JSON middleware
app.use(express.json());
console.log("Initializing routes...");
initializeAgentBeats(app);
console.log("Starting server on port 5050...");
app.listen(5050, function () {
    console.log("✅ Server is running on port 5050");
});

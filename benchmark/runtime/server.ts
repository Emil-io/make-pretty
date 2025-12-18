import cors from "cors";
import express, { Express } from "express";
import { initializeAgentBeats } from "./routes.js";

console.log("Starting server...");

const app: Express = express();

// Configure CORS to allow any connection, method, and header
app.use(cors({
    origin: '*',
}));

// Add JSON middleware
app.use(express.json());

console.log("Initializing routes...");
initializeAgentBeats(app);

console.log("Starting server on port 5050...");
app.listen(5050, () => {
    console.log("✅ Server is running on port 5050");
});

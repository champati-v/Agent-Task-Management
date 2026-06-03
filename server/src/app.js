import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes.js';
import agentRoutes from '../src/routes/agent.routes.js';
import uploadRoutes from '../src/routes/upload.routes.js';
import { userLogout } from '../src/controllers/auth.controller.js';


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//auth routes
app.use("/api/auth", authRoutes);
app.post("/api/logout", userLogout);
app.use("/api/agents", agentRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running Successfully"
  });
});

export default app;

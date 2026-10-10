import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import campusRoutes from './routes/campus.routes.js';
import roomRoutes from './routes/room.routes.js';
import careRoutes from './routes/care.routes.js';
import skillRoutes from './routes/skill.routes.js';
import sustainabilityRoutes from './routes/sustainability.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Express Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Uploads Directory
const uploadPath = path.join(process.cwd(), 'server', 'uploads');
app.use('/uploads', express.static(uploadPath));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'NextCampus API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount REST API endpoints supporting both /api/v1 and /api paths seamlessly
const mountApiEndpoints = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/campus`, campusRoutes);
  app.use(`${prefix}/smartrooms`, roomRoutes);
  app.use(`${prefix}/rooms`, roomRoutes);
  app.use(`${prefix}/care`, careRoutes);
  app.use(`${prefix}/skillcampus`, skillRoutes);
  app.use(`${prefix}/sustainability`, sustainabilityRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
};

mountApiEndpoints('/api/v1');
mountApiEndpoints('/api');

// Global Error Handler
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`[NextCampus Server] Running on http://localhost:${PORT}`);
  console.log(`[NextCampus API] Health check at http://localhost:${PORT}/api/health`);
});

export default app;

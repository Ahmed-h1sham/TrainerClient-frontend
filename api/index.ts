import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

let expressServer: Express | null = null;

async function createExpressServer(): Promise<Express> {
  if (expressServer) {
    return expressServer;
  }

  const app = express();

  declare module "http" {
    interface IncomingMessage {
      rawBody: unknown;
    }
  }

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  // Register routes
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  // Error handling middleware
  app.use((err: any, _req: any, res: VercelResponse, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  expressServer = app;
  return app;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const app = await createExpressServer();
  return app(req, res);
}

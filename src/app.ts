import express, { Application, Request, Response } from "express";
import paperRoutes from "./routes/paper.routes";
import { connectDB } from "./config/database";
import { PaperService } from "./services/paper.service";

class App {
  public app: express.Application;
  private paperService: PaperService;

  constructor() {
    this.app = express();
    this.paperService = new PaperService();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupDatabase();
    this.setupPaperSync();
  }

  private async setupDatabase(): Promise<void> {
    await connectDB();
  }
  private setupPaperSync(): void {
    // Sync papers every hour
    setInterval(() => {
      this.paperService
        .syncPapers()
        .catch((error) => console.error("Paper sync failed:", error));
    }, 60 * 60 * 1000);
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.get("/api/health", (req: Request, res: Response) => {
      res.status(200).json({ status: "ok", message: "Server is running" });
    });

    this.app.use("/api/papers", paperRoutes);
  }
}

const app = new App().app;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

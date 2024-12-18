import express, { Application, Request, Response } from "express";
import paperRoutes from "./routes/paper.routes";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
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

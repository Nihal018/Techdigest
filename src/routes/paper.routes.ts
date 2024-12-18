import { Router } from "express";
import { PaperController } from "../controllers/paper.controller";

const router = Router();
const paperController = new PaperController();

router.post("/sync", (req, res) => paperController.syncPapers(req, res));
router.get("/", (req, res) => paperController.getPapers(req, res));
router.get("/:id", (req, res) => paperController.getPaperById(req, res));

export default router;

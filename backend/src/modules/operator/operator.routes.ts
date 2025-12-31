import { Router } from "express";
import {
  serveNextToken,
  skipCurrentToken,
  recallCurrentToken,
  pauseQueue,
  resumeQueue,
} from "./operator.controller.js";

const router = Router();

// Serve next token
router.post("/queues/:queueId/serve-next", serveNextToken);

// Skip current token
router.post("/queues/:queueId/skip", skipCurrentToken);

// Recall current token
router.post("/queues/:queueId/recall", recallCurrentToken);

// Pause queue
router.patch("/queues/:queueId/pause", pauseQueue);

// Resume queue
router.patch("/queues/:queueId/resume", resumeQueue);

export default router;
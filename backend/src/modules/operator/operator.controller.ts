import { Request, Response } from "express";
import { OperatorService } from "./operator.service.js";

// Serve next token in queue
export async function serveNextToken(req: Request, res: Response) {
  const { queueId } = req.params;

  const result = await OperatorService.serveNextToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

// Skip current token
export async function skipCurrentToken(req: Request, res: Response) {
  const { queueId } = req.params;

  const result = await OperatorService.skipCurrentToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

// Recall current token
export async function recallCurrentToken(req: Request, res: Response) {
  const { queueId } = req.params;

  const result = await OperatorService.recallCurrentToken(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

// Pause queue
export async function pauseQueue(req: Request, res: Response) {
  const { queueId } = req.params;

  const result = await OperatorService.pauseQueue(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

// Resume queue
export async function resumeQueue(req: Request, res: Response) {
  const { queueId } = req.params;

  const result = await OperatorService.resumeQueue(queueId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}
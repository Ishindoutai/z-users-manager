import { Request, Response, NextFunction } from 'express';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, permissions } = req.body;
  
  if (!email || !password || !permissions) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  if (!Array.isArray(permissions)) {
    res.status(400).json({ error: 'Permissions must be an array' });
    return;
  }
  
  next();
  return;
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { permissions } = req.body;
  
  if (!permissions) {
    res.status(400).json({ error: 'Missing permissions field' });
    return;
  }
  
  if (!Array.isArray(permissions)) {
    res.status(400).json({ error: 'Permissions must be an array' });
    return;
  }
  
  next();
  return;
};
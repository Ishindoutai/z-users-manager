import { Request, Response, NextFunction } from 'express';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, permissions } = req.body;
  
  if (!email || !password || !permissions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Permissions must be an array' });
  }
  
  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { permissions } = req.body;
  
  if (!permissions) {
    return res.status(400).json({ error: 'Missing permissions field' });
  }
  
  if (!Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Permissions must be an array' });
  }
  
  next();
};
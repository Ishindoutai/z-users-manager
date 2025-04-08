import { Request, Response } from 'express';
import { createUser, getUsers as getUsersService, updateUser as updateUserService } from './users.service';
import { UserCreateData, UserUpdateData } from './users.types';
import { validateCreateUser, validateUpdateUser } from '../middleware';

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    validateCreateUser(req, res, async () => {
      const userData: UserCreateData = req.body;
      const result = await createUser(userData);
      res.status(201).json(result);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    validateUpdateUser(req, res, async () => {
      const { uid } = req.params;
      const userData: UserUpdateData = req.body;
      const result = await updateUserService(uid, userData);
      res.status(200).json(result);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};
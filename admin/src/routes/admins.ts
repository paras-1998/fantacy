import express from 'express';
import { authHandler } from '../middleware/admin/auth.middleware';
import * as admin from '../controller/admin.controller';
const router = express();

router.get('/',authHandler,admin.list);
router.post('/',authHandler,admin.create);
router.post('/authenticate',admin.authenticate);
router.delete('/',authHandler,admin.deleteMany);
router.get('/:id',authHandler,admin.getOne);
router.put('/:id',authHandler,admin.update);
router.delete('/:id',authHandler,admin.deleteOne);
export { router as adminRouter };
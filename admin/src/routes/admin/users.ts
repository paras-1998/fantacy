import express from 'express';
import { authHandler } from '../../middleware/admin/auth.middleware';
import * as user from '../../controller/admin/user.controller';
const router = express();

router.get('/',authHandler,user.list);
router.post('/',authHandler,user.create);
router.delete('/',authHandler,user.deleteMany);
router.delete('/:id',authHandler,user.deleteOne);
router.get('/:id',authHandler,user.getOne);
router.put('/:id',authHandler,user.update);
export { router as UsersRouter };
import express from 'express';
import { authHandler } from '../../middleware/admin/auth.middleware';
import * as config from '../../controller/admin/config.controller';
const router = express();

router.get('/get',authHandler,config.get);
// router.post('/',authHandler,config.create);
// router.delete('/',authHandler,config.deleteMany);
// router.get('/:id',authHandler,config.getOne);
router.put('/set',authHandler,config.set);
export { router as ConfigsRouter };
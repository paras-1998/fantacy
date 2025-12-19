import express from 'express';
import { authHandler } from '../../middleware/admin/auth.middleware';
import * as session from '../../controller/admin/session.controller';
const router = express();

router.get('/',authHandler,session.list);
router.delete('/',authHandler,session.deleteMany);
router.get('/timeslots',authHandler,session.timeslots);
router.post('/',authHandler,session.create);

router.get('/:id',authHandler,session.getOne);
router.put('/:id',authHandler,session.update);
router.delete('/:id',authHandler,session.deleteOne);

export { router as sessionRouter };

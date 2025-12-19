import express from 'express';
import { authHandler } from '../../middleware/admin/auth.middleware';
import * as balancehistory from '../../controller/admin/balancehistory.controller';
const router = express();

router.get('/',authHandler,balancehistory.list);


export { router as balancehistoryRouter };
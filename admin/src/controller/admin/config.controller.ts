const assert = require("assert");
import { Request, Response, NextFunction } from 'express';

import HttpExceptionError from '../../common/admin/http-exception';

import { Config as  ConfigInterface , updateConfig  }  from '../../interfaces/admin/configs/config.interface';

import * as configServices from '../../services/admin/config.service';

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let data : ConfigInterface = await configServices.get("commissionPercentage");
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Config.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};


export const set = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userData: updateConfig = req.body;
        
        let data : ConfigInterface = await configServices.set(userData);
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Config.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
import { Request, Response, NextFunction } from 'express';
import HttpExceptionError from '../common/http-exception';
import { findOneById } from '../services/admins.service';
const jwt = require('jsonwebtoken');
import { config } from '../../config';
interface newRequest extends Request {
    user: any;
}

export const authHandler = async(request: newRequest, response: Response, next: NextFunction) => {
    try {
        let token = request.headers.authorization; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
            if (token) {
                const tokenData = jwt.verify(token, config.token.access_token);
                const user = await findOneById(tokenData.id,"status lv");
                if (!user) {
                    throw new Error('NOT AUTHORIZED');
                }
                request.user = user;
                next();
            }
            else{
                throw new Error('Auth token is not supplied');    
            }
        }
        else{
            throw new Error('Auth token is not supplied');
        }
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const tokenHandler = async(request: newRequest, response: Response, next: NextFunction) => {
    try {
        let token = request.headers.authorization; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
            if (token) {
                const tokenData = jwt.verify(token, config.token.access_token);
                const user = await findOneById(tokenData.id,"status lv");
                if (!user) {
                    throw new Error('NOT AUTHORIZED');
                }
                request.user = user;
                next();
            }
            else{
                next();
            }
        }
        else{
            next();
        }
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
import { Request, Response, NextFunction } from 'express';

import { BalanceHistory as  BalanceHistoryInterface  }  from '../../interfaces/admin/balanceHistory/balancehistory.interface';
import * as balancehistoryServices from '../../services/admin/balancehistory.service';
import HttpExceptionError from '../../common/admin/http-exception';

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        let query = {};
        let filter = JSON.parse(req.query.filter.toString());
        let filterQuery: any = filter;
        if(filter.q){
            
            query["$or"]  = [
                /* { "winner": new RegExp(filter.q, "i") },
                { "winnerType": new RegExp(filter.q, "i") } */
            ] ;
            delete filterQuery["q"];

        }
        if(filterQuery){
            query = {...filterQuery,...query};
        }
        let page : number = (req.query.page) ? Number(req.query.page) : 1;
        let perPage : number =  (req.query.perPage) ? Number(req.query.perPage) : 10 ;
        let data : BalanceHistoryInterface[] = await  balancehistoryServices.list(query,page,perPage);
        let count : BalanceHistoryInterface[] = await  balancehistoryServices.countDoc(query);
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
            count
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
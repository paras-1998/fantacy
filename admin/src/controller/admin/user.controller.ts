const assert = require("assert");
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import mongoose from 'mongoose';
import HttpExceptionError from '../../common/admin/http-exception';
import { User as  UserInterface , updateUser , listUserFilter ,CreateUdrtInterface }  from '../../interfaces/admin/users/user.interface';

import * as userServices from '../../services/admin/users.service';
import * as transactionServices from '../../services/admin/transactions.service';
import * as balancehistoryServices from '../../services/admin/balancehistory.service';

interface newRequest extends Request {
    user: any;
}



export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        let query = {};
        let filter = JSON.parse(req.query.filter.toString());
        let filterQuery: listUserFilter = filter;
        console.log("filterQuery ",filterQuery);
        if(filter.id){
            let _ids = [];
            for(let id of filter.id){
                _ids.push(new mongoose.Types.ObjectId(id));
            }
            if(_ids.length> 0){
                query["_id"] = { $in : _ids };
            }
        }
        if(filter.q){
            console.log("|filter.q "+filter.q);
            
            query["$or"]  = [
                { "userName": new RegExp(filter.q, "i") },            
            ] ;
            delete filterQuery["q"];

        }
        if(filterQuery){
            query = {...filterQuery,...query};
        }
        let page : number = (req.query.page) ? Number(req.query.page) : 1;
        let perPage : number =  (req.query.perPage) ? Number(req.query.perPage) : 10 ;
        let data : UserInterface[] = await  userServices.list(query,page,perPage);
        let count : UserInterface[] = await  userServices.countDoc(query);
        return res.status(200).send({
            success: true,
            message: "Users.",
            data,
            count
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let data : UserInterface = await userServices.findOneById(id,"_id username email status");
        data["id"] = data._id;
        
        return res.status(200).send({
            success: true,
            message: "User.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        assert(req.body.username, "username is required");
        assert(req.body.password, "password is required");
        
        let userData: CreateUdrtInterface = req.body;

        if( await userServices.duplicateusernameValidation(userData.username) ){
            throw new Error('User is already registered.');
        }
        
        let data = await userServices.create(userData);
        userData["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Saved successfully.",
            data:userData
        });
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const update = async (req: newRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let userData: updateUser = req.body;

        let Olddata : UserInterface = await userServices.findOneById(id,"balance");


        let amount = 0;
        if(userData.balance){
            amount = userData.balance;
            delete userData.balance;
        }
        let newDt = { $set : userData };
        if( userData["balanceType"] !== "None" && amount > 0 ){
            if(userData["balanceType"] == "Add"){
                newDt["$inc"] = { "balance" : amount  };
            }
            else if(userData["balanceType"] == "Remove"){
                newDt["$inc"] = { "balance" : -amount  };
            }
        }
        
        
        let data : UserInterface = await userServices.findNupdateOneById(id,newDt);

        const todayDT =  moment().utcOffset("+05:30").format('DD-MM-YYYY');
        let todayTransactions = await transactionServices.findTransactionTheDay(id,todayDT);

        if( userData["balanceType"] !== "None" && amount > 0 ){
            if(userData["balanceType"] == "Add"){
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            ar : amount
                        } 
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        ar : amount,
                        cb :data.balance
                    });
                }
                await balancehistoryServices.create({ admin:req.user._id, user:id , amount:amount });
            }
            else if(userData["balanceType"] == "Remove"){
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            aPay : amount
                        } 
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        aPay : amount,
                        cb :data.balance
                    });
                }
                await balancehistoryServices.create({ admin:req.user._id, user:id , amount:-amount });
            }
        }
        
        
        
        /* if(Olddata.balance !== data.balance){
            
            if(Olddata.balance > data.balance ){
                let deductedAmt = (Olddata.balance - data.balance);
                // balance is removed
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            ar : -deductedAmt
                        } 
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        ar : -deductedAmt,
                        cb :data.balance
                    });
                }

            }
            else if(Olddata.balance < data.balance){ 
                let addedAmt = (  data.balance -Olddata.balance);
                // balance added
                if(todayTransactions){
                    await transactionServices.findNupdateOneById(todayTransactions._id,{
                        $set:{
                            cb :data.balance
                        },
                        $inc : {
                            ar : addedAmt
                        } 
                    });
                }
                else{
                    await transactionServices.create({
                        dt:todayDT,
                        user:id,

                        ob: Olddata.balance,
                        ar : addedAmt,
                        cb :data.balance
                    });
                }
            }
        } */

        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Users.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const deleteMany = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let filter = JSON.parse(req.query.filter.toString());
        if(filter.id){
            let users = await userServices.findManyById(filter.id,"pp");
            for(let user of users){
                //user.pp
                //user._id
                await userServices.deleteUser(user._id);
            }
        }
        return res.status(200).send({
            success: true,
            message: "User deleted.",
            data : filter.id,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
try {
        const { id } = req.params;

        const deletedUser = await  await userServices.deleteUser(id);;

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ react-admin expects the deleted record in response
        res.json({ data: deletedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
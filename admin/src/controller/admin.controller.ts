const assert = require("assert");
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose'

import HttpExceptionError from '../common/admin/http-exception';

import { Admin as  AdminInterface ,LoginInterface }  from '../interfaces/admins/admin.interface';

import * as adminsServices from '../services/admins.service';
const { generateHash , compareData} = require('../common/bcrypt');
const { generateAccessToken } = require('../common/token');

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('[ADMIN LOGIN] Request body:', req.body);
        assert(req.body.email, "Email is required");
        assert(req.body.password, "password is required");

        let data: LoginInterface = req.body;
        /* data.email = String(data.email);
        data.password = String(data.password); */
        
        const regx =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validEmail = regx.test(String(data.email.toString()));
        
        if(!validEmail){
            console.log('[ADMIN LOGIN] Invalid email format:', data.email);
            throw new Error('Invalid email.');
        }
        console.log('[ADMIN LOGIN] Looking for admin with email:', data.email);
        let admin : AdminInterface = await adminsServices.findOneByEmail(data.email, "password name");
        if (!admin) {
            console.log('[ADMIN LOGIN] Admin not found');
            throw new Error('User not found.');
        }
        console.log('[ADMIN LOGIN] Admin found:', admin.name);
        //Authorization process
        const isMatch = await compareData(data.password, admin.password);
        console.log('[ADMIN LOGIN] Password match:', isMatch);
        if(!isMatch){
            throw new Error('Incorrect password.');
        }
        const auth = await generateAccessToken(admin._id);
        admin.id = admin._id;
        res.status(200).send({
            success: true,
            message: "Login successfully.",
            data:admin,
            auth
        });
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let page : number = Number(req.query.page) ;
        let perPage : number = Number(req.query.perPage) ;
        let data : AdminInterface[] = await  adminsServices.list({},page,perPage);
        let count = await  adminsServices.countDoc({});
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
            count
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        assert(req.body.name, "name is required");
        assert(req.body.email, "email is required");
        assert(req.body.password, "password is required");
        
        let adminData: AdminInterface = req.body;

        const regx =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validEmail = regx.test(String(adminData.email));

        if(!validEmail){
            throw new Error('Invalid email.');
        }
        if( await adminsServices.duplicateEmailValidation(adminData.email) ){
            throw new Error('Email is already registered.');
        }
        adminData.password = await generateHash(adminData.password);
        let data = await adminsServices.create(adminData);
        adminData["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Saved successfully.",
            data:adminData
        });
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let data : AdminInterface = await adminsServices.findOneById(id,"name email");
        data.id = data._id;
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        assert(req.body.name, "name is required");
        assert(req.body.email, "email is required");
        let adminData: AdminInterface = req.body;
        if(adminData?.password){
            adminData.password = await generateHash(adminData.password);
        }
        
        let data : AdminInterface = await adminsServices.findNupdateOneById(id,adminData);
        data.id = data._id;
        return res.status(200).send({
            success: true,
            message: "Admin.",
            data,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await adminsServices.deleteOneById(id);
        return res.status(200).send({
            success: true,
            message: "Group session deleted.",
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const deleteMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let filter = JSON.parse(req.query.filter.toString());
        if(filter.id){
            let _ids = [];
            for(let id of filter.id){
                _ids.push(new mongoose.Types.ObjectId(id));
            }
            await adminsServices.deleteManyById(_ids);
        }
        return res.status(200).send({
            success: true,
            message: "deleted.",
            data : filter.id,
        });
    }catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
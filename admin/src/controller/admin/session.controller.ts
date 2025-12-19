import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
const assert = require("assert");

import HttpExceptionError from '../../common/admin/http-exception';
import { Session as SessionInterface, listFilter, createSession, updateSession } from '../../interfaces/admin/sessions/session.interface';

import * as sessionsServices from '../../services/admin/sessions.service';


export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let query: Record<string, any> = {};
        let filter = JSON.parse(req.query.filter.toString());
        let filterQuery: listFilter = filter;
        console.log("filterQuery ", filterQuery);
        if (filter.q) {

            query["$or"] = [
                { "winner": new RegExp(filter.q, "i") },
                { "winnerType": new RegExp(filter.q, "i") }
            ];
            delete filterQuery["q"];

        }

        const last48Hours = new Date();
        last48Hours.setHours(last48Hours.getHours() - 48);

        query.createdDate = { $gte: last48Hours };

        if (Object.keys(filterQuery).length > 0) {
            query = { ...filterQuery, ...query };
        }

        // if (filterQuery) {
        //     query = { ...filterQuery, ...query };
        // }

        let page: number = (req.query.page) ? Number(req.query.page) : 1;
        let perPage: number = (req.query.perPage) ? Number(req.query.perPage) : 10;
        let data: SessionInterface[] = await sessionsServices.list(query, page, perPage);
        let count: SessionInterface[] = await sessionsServices.countDoc(query);
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
            count
        });
    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const timeslots = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const now = moment().utcOffset("+05:30");
        const minutesB = Math.floor(now.minutes() / 5) * 5; // Align to the nearest 5-minute interval
        let startB = now.clone().startOf('hour').add(minutesB, 'minutes');

        let data = [];
        for (let index = 0; index < 288; index++) {

            startB = startB.add(5, 'minutes');
            data.push({ id: startB.toString() });

        }
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
            //count
        });
    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

// fetch session by ID
let data = await sessionsServices.findOneById(id, "");

// set `id` for front-end
data["id"] = data._id;

// ✅ set default winnerType if blank
if (!data.winnerType) {
    data.winnerType = "1X";
}

return res.status(200).send({
    success: true,
    message: "Session.",
    data,
});

    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        assert(req.body.startTime, "startTime is required");
        assert(req.body.winnerType, "winnerType is required");
        assert(req.body.winner, "winner is required");

        let userData: createSession = req.body;

        const start = moment(userData.startTime).utcOffset("+05:30");
        const end = start.clone().add(5, 'minutes');
        userData.startTime = start;
        userData.endTime = end;


        let data = await sessionsServices.create(userData);
        userData["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Saved successfully.",
            data: userData
        });
    }
    catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let userData: updateSession = req.body;

        let data: SessionInterface = await sessionsServices.findNupdateOneById(id, userData);
        data["id"] = data._id;
        return res.status(200).send({
            success: true,
            message: "Sessions.",
            data,
        });
    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const deleteMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let filter = JSON.parse(req.query.filter.toString());
        if (filter.id) {
            let sessions = await sessionsServices.findManyById(filter.id, "totalQty");
            for (let session of sessions) {
                if (session.totalQty == 0) {
                    await sessionsServices.deleteSession(session._id);
                }
            }
        }
        return res.status(200).send({
            success: true,
            message: "session deleted.",
            data: filter.id,
        });
    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};
export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await sessionsServices.deleteSession(id);
        return res.status(200).send({
            success: true,
            message: "Group session deleted.",
        });
    } catch (err) {
        return next(new HttpExceptionError(400, 'no errorkk', err.message));
    }
};

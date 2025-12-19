export interface User {
    _id? :         any;
    username :         string;
    password:         string;
    balance:         number;
    status: number;
    verified: number;
    createdAt:   Date;    
    updatedAt:   Date;    
}


export interface updateUser {
    password:         string;
    balance?:         number;
    status?:         number;
}


export interface listUserFilter {
    ismoderator : Boolean;
}

export interface CreateUdrtInterface {    
    username :         string;
    password:         string;
    balance?:         number;
}

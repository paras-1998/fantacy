export interface Admin {
    _id? :         any;
    id? :         any;
    name :         string;
    email :         string;
    password:         string;
    createdAt:   Date;    
    updatedAt:   Date;    
}

export interface LoginInterface {    
    email :         string;
    password:         string;
}


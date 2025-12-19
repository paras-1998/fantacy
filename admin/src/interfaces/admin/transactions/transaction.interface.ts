export interface Transaction {
    _id? :         any;
    user? :         any;
    

    dt: Date,
    
    ar: Number,
    ob: Number,
    cb: Number,
    ap  : Number,
    aw: Number,
    aComm: Number,
    aPay: Number,
    
    createdDate:   Date;    
    updatedAt:   Date;    
}
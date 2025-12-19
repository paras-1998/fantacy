export interface Session {
    _id? :         any;

    startTime: Date,
    endTime: Date,

    Shree: Number,
    Vashikaran: Number,
    Sudarshan: Number,
    Vastu: Number,
    Planet: Number,
    Love: Number,
    Tara: Number,
    Grah: Number,
    Matsya: Number,
    Meditation: Number,


    ShreeAmount: Number,
    VashikaranAmount: Number,
    SudarshanAmount: Number,
    VastuAmount: Number,
    PlanetAmount: Number,
    LoveAmount: Number,
    TaraAmount: Number,
    GrahAmount: Number,
    MatsyaAmount: Number,
    MeditationAmount: Number,

    totalAmount: Number,
    totalQty: Number,
    payout: Number,

    

    winner: [string],
    winnerType: string,

    isDone : Number,

    createdAt:   Date;    
    updatedAt:   Date;    
}


export interface listFilter {
    // startTime: Date,
    // endTime: Date,
    winner: [string],
    winnerType: string,
}

export interface createSession {
    startTime: any,
    endTime: any,
    winner: [string],
    winnerType: string,
}


export interface updateSession {
    winner: [string],
    winnerType: string,
}
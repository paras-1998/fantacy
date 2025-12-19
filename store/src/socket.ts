"use client";

import { io } from "socket.io-client";
export const Socket = (token?:string) => io({

    extraHeaders: {
      authorization: `bearer ${token}`
    }
  });

 /*  export const Socket = (token?:string) => io({
    reconnection: false
  }); */
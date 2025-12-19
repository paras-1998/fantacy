export default class HttpExceptionError /* extends Error */ {
    //statusCode?: number;
    status?: number;
    message: string;
    //error: string | null;
  
    constructor(statusCode: number, message: string, error?: string) {
      //super(message);
      //this.statusCode = statusCode;
      this.status = statusCode;
      this.message = error || null;
      //this.error = error || null;
    }
  }
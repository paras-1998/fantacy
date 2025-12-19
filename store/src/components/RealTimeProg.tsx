import moment from 'moment';
import React, { useEffect, useState } from "react";
const RealTimeClock = ({time}:{time:string}) => {
  return (
    <>
    {moment(time).format('DD-MM-YYYY hh:mm:ss A')} 
    </>
  );
};
export default RealTimeClock;

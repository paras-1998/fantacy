import moment from 'moment';

export const RealTimeMMSS = ({timeLeft}:{timeLeft:number}) => {
    return (
      <>
      { moment.utc(timeLeft*1000).format('mm:ss') } 
      </>
    );
  };

export default RealTimeMMSS;

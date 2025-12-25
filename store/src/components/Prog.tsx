"use client";
import React, { useState , useEffect , useRef, forwardRef } from "react";
import { useRouter } from "next/router";
import moment from 'moment';
import '../css/program.css';
import { Socket } from "../socket";
import { useReactToPrint } from "react-to-print";
import JsBarcode from "jsbarcode";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image'

const RealTimeProg = dynamic(() => import("@/components/RealTimeProg"), {
  ssr: false, // Disable server-side rendering
});

const RealtimeMMSS = dynamic(() => import("@/components/RealtimeMMSS"), {
  ssr: false, // Disable server-side rendering
});


const images = [
  { name: "Shree", src: "/yantra_shree.jpeg" },
  { name: "Vashikaran", src: "/yantra_vashikaran.jpeg" },
  { name: "Sudarshan", src: "/yantra_sudarshan.jpeg" },
  { name: "Vastu", src: "/yantra_vastu.jpeg" },
  { name: "Planet", src: "/yantra_planet.jpeg" },
  { name: "Love", src: "/yantra_love.jpeg" },
  { name: "Tara", src: "/yantra_tara.jpeg" },
  { name: "Grah", src: "/yantra_grah.jpeg" },
  { name: "Matsya", src: "/yantra_matsya.jpeg" },
  { name: "Meditation", src: "/yantra_meditation.jpeg" },
];

const ImageSlider = () => {
  const [frontIndex, setFrontIndex] = useState(0); //
  const [backIndex, setBackIndex] = useState(1); //
  const [curIndex, setcurIndex ] = useState(1); //
  const [isFlipping, setIsFlipping] = useState(false); // Flip animation state

  useEffect(() => {    
    const interval1 = setInterval(() => {
      (curIndex >= (images.length-1) ) ? setcurIndex(0) : setcurIndex(curIndex+1);
      if(isFlipping ){
        // Show back
        setIsFlipping(false);
        setFrontIndex(curIndex);        
      }
      else{
        //Show Front
        setIsFlipping(true);
        setBackIndex(curIndex);
        
      }
      
    }, 2000);

    return () => { 
      clearInterval(interval1); 

    };
  }, [isFlipping,backIndex,frontIndex]);

  return (
    <div className="image-slider object-contain ">
      <div className={`flip-container ${isFlipping ? "flip" : ""}`}>
        
        <div className="front  ">
          <Image
            src={images[frontIndex].src}
            alt={images[frontIndex].name}
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto slider-image "
          />
        </div>

        <div className="back">
          <Image
            src={images[backIndex].src}
            alt={images[backIndex].name}
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto slider-image"
          />
        </div>
      </div>
    </div>
  );
};

const ReceiptContent = forwardRef<HTMLDivElement, { lastOrder: { currentSession?: any; order?: any; ticket?: any; }|null  }>(({lastOrder}, ref) => {
  const barcodeRef = useRef<HTMLCanvasElement>(null);
  const [ orderItem , setOrderItems ] = useState<string[]>([]);
  useEffect(() => {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, lastOrder?.ticket?.ticketNo, {
          format: "CODE128",
          displayValue: false,
          height: 50,
          margin: 0,
        });
      }
      if(lastOrder?.order){
        setOrderItems(Object.keys(lastOrder?.order || {}))
      }
  }, [lastOrder]);

  if (!lastOrder) {
    return null; // Avoid rendering until data is available
  }


  return (
    <div
      ref={ref}
      className="bg-white w-[80mm] p-4 pt-1 pb-1 text-gray-800 text-sm font-mono"
    >
      {/* Receipt Header */}
      <div className="text-center mb-0">
        <h1 className="text-lg font-bold">HONESTPRO ONLINE MARKETING</h1>
        <div className="flex justify-around">
          <p className="font-bold text-xs">Receipt No: {lastOrder?.ticket?.ticketNo}</p>
        </div>
      </div>

      {/* Receipt Meta Info */}
      <div className="mb-1" >
        <div className="flex flex-nowrap justify-around">
          <div className="w-1/2 text-center text-xs ">
            <p className="font-bold text-xs text-center">Draw Time:</p>
            <p className="text-xs" >{moment(lastOrder?.currentSession?.startTime).format('hh:mm A')}-{moment(lastOrder?.currentSession?.endTime).format('hh:mm A')}</p>
          </div>
          <div className="w-1/2 text-center text-xs" >
            <p className="font-bold text-xs">Purchase Time:</p>
            <p className="text-xs" >{moment(lastOrder?.ticket?.createdDate).format('DD-MM-YYYY hh:mm:ss A')} </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-around">
          <p className="font-bold text-xs">AID:{lastOrder?.ticket?.aid}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="my-1">
        <div className="flex font-bold border border-dotted border-black p-2 pt-0 pb-0">
          <p className="flex-1 border-r border-dotted border-black ">Yantra</p>
          <p className="w-12 border-r border-dotted border-black text-center">Qty</p>
          <p className="w-16 border-r border-dotted border-black text-center">Price</p>
          <p className="w-16 text-center">Total</p>
        </div>
        
        { 
        
        orderItem.map((item:any,i) => (
          <div className="flex border border-dotted border-black p-2 pt-0 pb-0 text-xs" key={"it-"+i}>
            <p className="flex-1 text-xs">{item}</p>
            <p className="w-12 text-center text-xs">{lastOrder?.ticket[item]}</p>
            <p className="w-16 text-center text-xs">11</p>
            <p className="w-16 text-center text-xs ">{lastOrder?.ticket[item+"Amount"]}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-black my-1"></div>

      {/* Totals */}
      <div className="flex justify-between font-bold my-1">
        <p>Total Qty:</p>
        <p>{lastOrder?.ticket["totalQty"]}</p>
        <p>Total:</p>
        <p>{lastOrder?.ticket["totalAmount"]}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-1"></div>

      {/* Barcode */}
      <div className="text-center mt-0">
        <canvas className="mx-auto w-full h-12" ref={barcodeRef}></canvas>
      </div>
    </div>
  );
});
ReceiptContent.displayName = "Receipt";

const WinTicketContent = forwardRef<HTMLDivElement, { winTicket: { sessionData?: any; order?: any; ticket?: any; totalAmount?:number  }|null  }>(({winTicket}, ref) => {
  
  useEffect(() => {
  }, [winTicket]);

  if (!winTicket?.order) {
    return null; // Avoid rendering until data is available
  }

  // Calculate total quantity
  const totalQty = winTicket.order.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);

  return (
    <div
      ref={ref}
      className="bg-white w-[80mm] p-4 py-0 text-gray-800 text-sm font-mono"
    >
      {/* Receipt Header */}
      <div className="text-center mb-0">
        <h1 className="text-lg font-bold">HONESTPRO ONLINE MARKETING</h1>
        <div className="flex flex-col justify-around">
          <p className="font-bold text-xs">Receipt No: {winTicket?.ticket?.ticketNo}</p>
          <h1 className="text-xs font-bold">WINNER RECEIPTS</h1>
          <h3 className="text-xs font-black">Congratulations!</h3>
        </div>
      </div>
      <div className="mb-1" >
        <div className="flex flex-nowrap justify-around">
          <div className="w-1/2 text-center text-xs ">
            <p className="font-bold text-xs text-center">Draw Time:</p>
            <p className="text-xs" >{moment(winTicket?.sessionData?.startTime).format('hh:mm A')}-{moment(winTicket?.sessionData?.endTime).format('hh:mm A')}</p>
          </div>
          <div className="w-1/2 text-center text-xs" >
            <p className="font-bold text-xs">Purchase Time:</p>
            <p className="text-xs line-clamp-2" >{moment(winTicket?.ticket?.createdDate).format('DD-MM-YYYY hh:mm:ss A')}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-around">
          <p className="font-bold text-xs">AID:{winTicket?.ticket?.aid}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-1">
        <div className="flex font-bold border border-dotted border-black p-2 pt-0 pb-0">
          <p className="flex-1">Yantra</p>
        </div>

        { 
        
        winTicket.order.map((item:any,i:number) => (
          
          <div className="flex justify-around border border-dotted border-black p-2 pt-0 pb-0 text-xs" key={"wt-"+i}>
            <p className="font-bold border-r border-dotted border-black p-2 pt-0 pb-0 text-xs">{i+1}</p>
            <p className="font-bold">{item.yantra}</p>
            <p className="font-bold">{winTicket?.sessionData.winnerType}</p>
            <p className="font-bold">=</p>
            <p className="font-bold">{item.qty} Silver Coin</p>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="flex justify-between font-bold my-1">
        <p>Total Coin:</p>
        <p>{totalQty}</p>
      </div>
      <div className="flex justify-between font-bold my-1">
        <p>Total:</p>
        <p>{winTicket?.totalAmount || 0}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-black my-2"></div>
    </div>
  );
});
WinTicketContent.displayName = "WinTicket";

export default function Prog() {
  
  const socketRef:any = useRef(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const winTicketRef = useRef<HTMLDivElement>(null);

  const [isPrinting, setIsPrinting] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [isCancellingTicket, setIsCancellingTicket] = useState(false);
  const isSubmittingTicketRef = useRef(false);
  const isCancellingTicketRef = useRef(false);
  // We store the resolve Promise being used in `onBeforePrint` here
  const promiseResolveRef = useRef<any>(null);

  const winListEndRef = useRef<HTMLInputElement>(null);

  const [shouldPrint, setShouldPrint] = useState(false);
  
  const router = useRouter();
  //const socket =  Socket();
  //socketRef.current.off();
  //socketRef.current.disconnect();

  const inputForAll = useRef<HTMLInputElement>(null);
  const ticketInput = useRef<HTMLInputElement>(null);
  

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];


  const [winnerbord, setWinnerbord] = useState([{}]);

  const [showBal, setShowBal] = useState(1);

  const [order, setOrder] = useState({});
  const orderRef = useRef(order);
  const [total, settotal] = useState(" 0 | 0");
  const [lastOrderID, setLastOrderID] = useState("");
  const lastOrderIDRef = useRef(lastOrderID);
  

  const [timeLeft, setTimeLeft] = useState(0);
  const timeLeftRef = useRef(timeLeft);
  const [endTime, setEndTime] = useState("");
  const [now, setNow] = useState("");
  const [totalAmt, settotalAmt] = useState(0);
  const totalAmtRef = useRef(totalAmt);

  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const balanceRef = useRef(balance);

  const [winner, setWinner] = useState<{ card?: string[]; type?: string; }>({});

  
  const [lastOrder, setLastOrder] = useState<{ currentSession?: any; order?: any; ticket?: any; }|null>(null);
  const lastOrderRef = useRef(lastOrder);
  
  const [winTicket, setWinTicket] = useState<{ sessionData?: any; order?: []; ticket?: any; totalAmount?:number }|null>(null);
  const _winTicketRef = useRef(winTicket);
  

  const [openEditAll, setOpenEditAll] = useState(false);

  const [wasFullScreen, setWasFullScreen] = useState(false);
  const _wasFullScreen = useRef(wasFullScreen);

  

  useEffect(() => {

    const _showBal = localStorage.getItem("showBal");
    if(_showBal){
      setShowBal(parseInt(_showBal))
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const validateToken = async () => {
      const response = await fetch("/api/auth/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!result.valid) {
        router.push("/login");
      }
      return;
    };
    validateToken();


    if (token) {
      fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => { setBalance(data.user.balance); balanceRef.current= data.user.balance; setUsername(data.user.username) })
        .catch(() => router.push("/login"));
    }
    else {
      router.push("/login"); // Redirect to login if no token
    }
    
    socketRef.current =  Socket(token);
    if (socketRef.current.connected) {
      onConnect();
    }
    window.addEventListener('keydown', handleKeyPress);

    

    function onConnect() {
      
      socketRef.current.emit("hello", "world", (response:any) => {
        if(inputRefs[0].current) {
          inputRefs[0].current.focus();
          inputRefs[0].current.select();
        }
      });
      socketRef.current.emit("winnerbord");
    }
    
    
    socketRef.current.on('winnerbord', (response:any) => {
      setWinnerbord(response);
      requestAnimationFrame(() => {
        setTimeout(() => {
          winListEndRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }, 10);
      });
      
    });

    function onError() {
      socketRef.current.disconnect();
    }

    

    
    
    socketRef.current.on('currentSession', (data:any) => {
        timeLeftRef.current = data.endInsec;
        setTimeLeft(data.endInsec);
        setEndTime(data.endTime);
        setNow(data.now);
    });

    socketRef.current.on('onwinner', (winner:string) => {
      declareWinner(winner);
      setLastOrderID("");
      setLastOrder(null);
      lastOrderIDRef.current = "";
      //lastOrderRef.current = null;
      setTimeout(() => {
        socketRef.current.emit("winnerbord");
      },4000);
    });



    function onDisconnect() {
      //setTransport("N/A");
    }

    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }

    socketRef.current.on("connect", onConnect);
    socketRef.current.on("disconnect", onDisconnect);
    socketRef.current.on("connect_error", onError);

    window.onload = () => {
      requestAnimationFrame(() => {
        
        setTimeout(() => {
          
          if (inputRefs[0].current) {
            inputRefs[0].current.focus();
            inputRefs[0].current.select();
          }
          winListEndRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }, 200); 
        
      });
    };

    return () => {
      socketRef.current.off("connect", onConnect);
      socketRef.current.off("disconnect", onDisconnect);
      socketRef.current.off("connect_error", onError);
      window.removeEventListener('keydown', handleKeyPress);
      socketRef.current.disconnect();
      
    };

    
  }, [router,isPrinting]);


  const handlePrintWinTick = useReactToPrint({ 
    contentRef:  winTicketRef,
    onBeforePrint: () => {
      _wasFullScreen.current = !!document.fullscreenElement;
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
      inputRefs[0].current?.select();
      inputRefs[0].current?.select();
      

      if(_wasFullScreen.current){
        const elem = document.documentElement as any; // Bypass TypeScript error
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
          elem.msRequestFullscreen();
        }
      }
    },
    onPrintError(errorLocation, error) {
      console.log("onPrintError ",errorLocation,error)
    },
  })


  const handleTicketSubmit = async (e:any) => {
    let value = e.target.value || ticketInput.current?.getAttribute("value");
    
    if (!/^\d*$/.test(value)) {
      value = value.replace(/\D/g, "");
    }
    if(!value){
      toast("Invalid TicketNo.");
      return false;
    }
    socketRef.current.emit("validateTicket", value, (response:any) => {
      if( typeof response !== "string" && Object.keys(response).length  ){
        response.ticket.aid = username;
        setWinTicket(response);
        _winTicketRef.current = response;
        let newBal = balanceRef.current + response.totalAmount;
        setBalance( newBal );
        balanceRef.current = newBal;
        const totalQty = response.order.reduce((acc:number, item:any) => acc + item.qty, 0);
        toast(
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 z-50">
            <span className="text-xl font-bold text-white drop-shadow-lg">Total Winning Coin: {totalQty}</span>
          </div>,
          {
            position: "top-center",
            autoClose: 1500,
            closeOnClick: true,
          }
        );
        setTimeout(() => {
          handlePrintWinTick();
          setTimeout(() => {
            if(inputRefs[0].current){          
              inputRefs[0].current?.focus();
              inputRefs[0].current?.select();
              inputRefs[0].current?.select();
            }
          }, 3500);
        }, 500);
      }
      else{
        toast(response);
        setTimeout(() => {
          if(inputRefs[0].current){          
            inputRefs[0].current?.focus();
            inputRefs[0].current?.select();
            inputRefs[0].current?.select();
          }
        }, 200);
      }
      e.target.value = "";
    });
  };

  
  const ticketQtychnageAll = async(e:any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, "");
    }
  };
  const ticketQtychnage = async(e:any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, "");
    }

    let newOrder :any = order;
    if(parseInt(e.target.value) ){
      newOrder[e.target.getAttribute("attr-yantra")] =  parseInt(e.target.value);
    }
    else{
      delete newOrder[e.target.getAttribute("attr-yantra")];
    }
    setOrder(newOrder);
    orderRef.current = newOrder;
    let totalQty =0, totalAmount = 0;
    for(let odr in newOrder){
      totalQty += newOrder[odr];
      totalAmount += (newOrder[odr] * 11)
    }
    settotal(totalQty+" | "+totalAmount);
    settotalAmt(totalAmount);
    totalAmtRef.current = totalAmount;
  };

  const ticketNumberchnage = async(e:any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, "");
    }
  };

  const handleClearBtn = async () => {
    const allWithClass = Array.from(
      document.getElementsByClassName('ticketQty')
    );
    allWithClass.forEach((element:any) => {
      element.value= "";
    });
    setOrder({});
    orderRef.current = {};
    settotal("0 | 0");
    settotalAmt(0);
    totalAmtRef.current = 0;
  };
  
  const handleCancelBtn= async() =>{ 
    if(isCancellingTicketRef.current){
      toast("Please wait, cancelling ticket...");
      return false;
    }
    //setLastOrderID()
    if(!lastOrderIDRef.current){
      toast("Invalid Moove.");
      return false;
    }
    setIsCancellingTicket(true);
    isCancellingTicketRef.current = true;
    socketRef.current.emit("cancelTicket", lastOrderIDRef.current, (response:any) => {
      if(  typeof response !== "string" && Object.keys(response).length  ){
        //setLastOrderID(response._id)
        setLastOrderID("");
        toast(lastOrderRef?.current?.ticket.ticketNo+" is cancelled.");
        lastOrderIDRef.current = "";
        lastOrderRef.current = null;
        setLastOrder(null);
        handleClearBtn();
        let newBal = balanceRef.current + response.lastamount;
        setBalance( newBal );
        balanceRef.current = newBal;
      }
      else{
        toast(response);
      }
      setIsCancellingTicket(false);
      isCancellingTicketRef.current = false;
    });
  }
  const handleExitBtn= async() =>{ router.push("/dashboard");}


  const handlePrint = useReactToPrint({ contentRef:  receiptRef,
    onBeforePrint: () => {
      _wasFullScreen.current = !!document.fullscreenElement;
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      //console.log("Reset the Promise resolve so we can print again------");
      promiseResolveRef.current = null;
      setIsPrinting(false);
      inputRefs[0].current?.select();
      inputRefs[0].current?.select(); // Select its content  
      

      const elem = document.documentElement as any;
      if(_wasFullScreen.current){
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
          elem.msRequestFullscreen();
        }
      }
    },
    onPrintError(errorLocation, error) {
      console.log("onPrintError ",errorLocation,error)
    },
   })
  const handlePrintBtn = async() =>{ 
    if(isSubmittingTicketRef.current){
      toast("Please wait, processing ticket...");
      return false;
    } 
    else if(Object.keys(orderRef.current).length  ){
      setIsSubmittingTicket(true);
      isSubmittingTicketRef.current = true;
      socketRef.current.emit("saveTicket", orderRef.current, (response:any) => {
        if( typeof response !== "string" && Object.keys(orderRef.current).length  ){
          orderRef.current = {};
          response.ticket.aid = username;
          setLastOrder(response);
          lastOrderRef.current = response;
          setLastOrderID(response.ticket._id);
          lastOrderIDRef.current = response.ticket._id;
          let newBal = balanceRef.current - totalAmtRef.current;
          setBalance( newBal );
          balanceRef.current = newBal;
          handleClearBtn();
          //handlePrint();
          setTimeout(() => {
            setShouldPrint(true);
          }, 500);
          inputRefs[0].current?.select();
        }
        else{
          toast(response);
        }
        setIsSubmittingTicket(false);
        isSubmittingTicketRef.current = false;
      });
    }
    else{
      toast("Please Enter Yantra.");
    }
  }

  const handleReprintBtn= async() =>{ 
    if(lastOrderRef.current !== null){
      setShouldPrint(true);
    }
  }

  // Function to declare a winner
  const declareWinner = (name:any) => {
    setWinner(name);
    // Hide the winner celebration after 10 seconds
    setTimeout(() => {
      setWinner({});
    }, 4000);
  };


  const closeEditallPopup = ()=>{
    setOpenEditAll(false);
    if (inputForAll.current) {
      inputForAll.current.value = "";
    }
  }
  const QtychnageAll = ()=>{
    setOpenEditAll(false);
    if (inputForAll.current) {
      const allWithClass = Array.from(
        document.getElementsByClassName('ticketQty')
      );
      let newOrder :any = order;
      let totalQty =0, totalAmount = 0;
      allWithClass.forEach((element:any) => {
        totalQty += (inputForAll.current) ? parseInt(inputForAll.current.value): 0;  
        totalAmount += ( ((inputForAll.current) ? parseInt(inputForAll.current.value): 0) * 11)
        element.value = (inputForAll.current) ? inputForAll.current.value: "";
        newOrder[element.getAttribute("attr-yantra")] = (inputForAll.current) ? parseInt(inputForAll.current.value): 0;  
        
      });
      setOrder(newOrder);
      orderRef.current = newOrder;
      settotal(totalQty+" | "+totalAmount);
      settotalAmt(totalAmount);
      totalAmtRef.current = totalAmount;
      inputForAll.current.value = "";
    }
  }
  
  let barcodeBuffer = ""; // Temporary storage for scanned characters
  let timeoutRef:any = null; // Timer to detect when scan is complete

  const handleKeyPress = (event: KeyboardEvent) => {
    if(event.key == " "){
      event.preventDefault();
      if(inputRefs[0].current){
        inputRefs[0].current?.focus();
        inputRefs[0].current?.select();
        inputRefs[0].current?.select();
      }
    }
    if (event.key === 'F2') {
      event.preventDefault();
      setOpenEditAll(true);
      
      requestAnimationFrame(() => {
        if (inputForAll.current) {
          inputForAll.current.focus();
          inputForAll.current.select();
          inputForAll.current.select();
        } 
      });
      
    }
    if (event.key === 'F3') {
      event.preventDefault();
        handleReprintBtn();
      
    }
    if (event.key === 'F4') {
      event.preventDefault();
      if(isCancellingTicketRef.current){
        toast("Please wait, cancelling ticket...");
        return false;
      }
      else if(timeLeftRef.current > 20 && lastOrderIDRef.current!=="" && !isCancellingTicketRef.current){
        handleCancelBtn();
      }
      else{
        toast("Invalid Move!");
      }
    }
    if (event.key === 'F5') {
      event.preventDefault();
      handleClearBtn();
      
    }
    if (event.key === 'F6') {
      event.preventDefault();
      if(isSubmittingTicketRef.current){
        toast("Please wait, processing ticket...");
        return false;
      }
      else if( timeLeftRef.current > 20 && balanceRef.current >= totalAmtRef.current && !isSubmittingTicketRef.current ){
        handlePrintBtn();
      }
      else if(balanceRef.current <= totalAmtRef.current){
        toast("Insufficient Balance!");
      }
      else{
        toast("Wait for next round.");
      }
    }
    if (event.key === 'F8') {
      event.preventDefault();
      if(ticketInput.current){
        ticketInput.current?.focus();
        ticketInput.current?.select();
      }
    }
    else if( event.key !== "Enter" ){
      barcodeBuffer += event.key;
      // Clear the timeout if new character is detected
      if (timeoutRef) clearTimeout(timeoutRef);

      // Set timeout to assume scan is complete after 300ms of inactivity
      timeoutRef = setTimeout(() => {
        if( parseInt(barcodeBuffer) > 111000 ){
          if(ticketInput.current){
            ticketInput?.current?.setAttribute("value",parseInt(barcodeBuffer).toString());
            ticketInput.current?.focus();
            ticketInput.current?.select();
            setTimeout(() => {
              const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
              ticketInput.current?.dispatchEvent(event);
              handleClearBtn();
            },50)
          }
        }
        barcodeBuffer = ""; // Reset for next scan
      }, 300);
    }
  };
  
  // Handle keydown event
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    
    if (!inputRefs[index].current) return;


    switch (event.key) {
      case "ArrowUp":
        if (index - 5 >= 0){
          inputRefs[index - 5].current?.focus();
          setTimeout(() => {
            const length : any = inputRefs[index - 5].current?.value.length; 
            inputRefs[index - 5].current?.setSelectionRange(length, length); 
          }, 0)
          
        }
        break;
      case "ArrowDown":
        if (index + 5 < inputRefs.length){
          
          inputRefs[index + 5].current?.focus();
          setTimeout(() => {
            const length :any = inputRefs[index + 5].current?.value.length; 
            inputRefs[index + 5].current?.setSelectionRange(length, length); 
          }, 0)
        }
        break;
      case "ArrowLeft":
        if (index - 1 >= 0){  
          inputRefs[index - 1].current?.focus(); 
          setTimeout(() => {
            const length : any = inputRefs[index - 1].current?.value.length ; 
            inputRefs[index - 1].current?.setSelectionRange(length,length); 
          }, 0)
        }
        break;
      case "ArrowRight":
        if (index + 1 < inputRefs.length){
          
          inputRefs[index + 1].current?.focus();
          setTimeout(() => {
            const length : any = inputRefs[index + 1].current?.value.length; 
            inputRefs[index + 1].current?.setSelectionRange(length, length); 
          }, 0)
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
      setShouldPrint(false); // Reset the flag after printingEST+
      setTimeout(() => {
        if(inputRefs[0].current){
          inputRefs[0].current?.focus();
          inputRefs[0].current?.select();
          inputRefs[0].current?.select();
        }
      }, 3500);
    }
  }, [shouldPrint]);

  if (!username) return <p>Loading...</p>;

  return (
    <div className="flex flex-col px-4 h-lvh-fallback" style={{ backgroundColor: '#425319ff'}}>
        <ToastContainer />
        <div style={{ display: "none" }}>
        <ReceiptContent ref={receiptRef} lastOrder={lastOrderRef.current} />
        </div>

        <div style={{ display: "none" }} >
        <WinTicketContent ref={winTicketRef} winTicket={_winTicketRef.current} />
          
        </div>
       
      {/* { Object.keys(winner).length > 0  && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="relative flex flex-col items-center pb-10  w-full h-full">
          <div className={`grid grid-cols-${winner?.card?.length} md:grid-cols-${winner?.card?.length} gap-4`}>
          
                {winner.card?.map((wincard:string, index:number) => {
                  const imageSrc = images.find((img) => img.name === wincard)?.src;
                  return (
                    <Image
                      key={index}
                      src={`${imageSrc}`}
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt={`Winner ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  );
                })}
            </div>
            { ( winner.type  == "2X" || winner.type  == "3X" )  && (
                    <Image
                      src={`/${winner.type}.png`}
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt={winner.type}
                      className="absolute w-1/12  object-cover rounded-lg shadow-md "
                    />
                  )} */}
            {/* Winner Text */}
            {/* <h1 className="text-4xl text-white font-bold mt-4 drop-shadow-lg">
              Winner: {winner.card?.join(', ')}
            </h1> */}
            {/* Close Overlay */}
            {/* <button
              onClick={() => setWinner({})}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )} */}

      {  (
        <div 
        className={`fixed  inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50  ${
          openEditAll ? "block" : "hidden"
        } `}
          
        >
          <div className="relative w-1/4 flex flex-col items-center pb-10">
              

              <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div>
                  <h5 className=" block text-xl font-medium text-gray-900  text-center dark:text-white">Enter Number</h5>
                  <input 
                    ref={inputForAll}
                    type="text"
                    className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"  
                    onChange={(e) => ticketQtychnageAll(e)}

                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        QtychnageAll();
                      }}
                    
                  />
                  <button
                    onClick={() => closeEditallPopup() }
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
                  >
                    Close
                  </button>
              </div>
                  
              </div>

          </div>
        </div>
      )}

      {/* Header */}
      <header className="top-0 text-white p-4 pb-2">
        <div className="flex justify-between items-center">
          {/* Left Side - Branding */}
          <div className="flex-1">
            <h1 id="heder1" className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl drop-shadow-2xl rye-regular" style={{ color: '#000'}}>HONEST PRO ONLINE MARKETING</h1>
            {/* <h1 id="heder1" className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl drop-shadow-2xl" style={{ fontFamily: 'Poppins, Montserrat, Roboto, sans-serif', letterSpacing: '0.02em' }}>
              <span style={{ color: '#000', fontWeight: '800' }}>HONEST</span>
              <span style={{ fontSize: '55%', verticalAlign: 'super', fontWeight: '900', marginLeft: '2px', marginRight: '4px', color: '#000' }}>PRO</span>
              <span style={{ fontWeight: '700', color: '#000' }}>ONLINE MARKETING</span>
            </h1> */}
          </div>
          
          {/* Right Side - Buttons */}
          <div className="flex gap-3">
            <button type="button" className="min-w-[180px] text-xl md:text-2xl lg:text-3xl inline-flex items-center justify-center px-6 py-3 font-bold text-white rounded-full transition-all" style={{ backgroundColor: '#000', border: '3px solid #000', fontFamily: 'Arial, sans-serif' }}>
              ID: {username}
            </button>

            <button 
              type="button" 
              className="min-w-[180px] text-xl md:text-2xl lg:text-3xl inline-flex items-center justify-center px-6 py-3 font-bold text-white rounded-full transition-all"
              style={{ backgroundColor: '#000', border: '3px solid #000', fontFamily: 'Arial, sans-serif' }}
              onClick={(e) => {setShowBal(showBal==1?0:1);localStorage.setItem("showBal", (showBal==1?"0":"1"));}}
            >
              {showBal?balance:"-"}
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Box 1 */}
        <div className="w-full lg:w-1/4 p-4 pt-0 pb-0 text-white">
          <div className="md:col-span-1 text-white grid grid-cols-2 gap-2">
            <div className="p-3 pt-0 text-4xl md:text-5xl shadow-lg font-extrabold text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#FFFFFF' }}>{moment(endTime).format('hh:mm A')}</div>
            <div className="p-3 pt-0 text-4xl md:text-5xl shadow-lg font-extrabold text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#FFFFFF' }}> <span><RealtimeMMSS timeLeft={timeLeft} /> </span></div>
          </div>
          <div className="slider overflow-hidden px-5">
            {/* Replace with your slider component */}
            <div className="relative h-full">
              <ImageSlider />
            </div>
          </div>
          {/* <div className="md:col-span-1 text-white grid grid-cols-2 gap-2 pt-5">
            <div className="p-3 pt-0 text-2xl md:text-3xl shadow-lg font-bold text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#FFFFFF' }}>F2:Jackpot</div>
            <div className="p-3 pt-0 text-2xl md:text-3xl shadow-lg font-bold text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#FFFFFF' }}>F8: Scan Ticket</div>
          </div> */}
        </div>

        {/* Box 2 */}
        <div className="w-full lg:w-3/4 p-4 pt-0 pb-0 text-white   flex flex-col">
          <div className="text-white p-4 pt-0 pb-2 text-4xl md:text-5xl font-extrabold shadow-lg" style={{ fontFamily: 'Arial, sans-serif', color: '#FFFFFF' }}>
            <RealTimeProg time={now}  />
          </div>
          <div className="text-white p-1 grid grid-cols-5 gap-2">
              {inputRefs.map((ref, index) => (

                <div className="rounded-lg " style={{ width: '90%' }} key={"ir-"+index}>
                <div className="flex flex-col items-center">
                    <Image 
                      className="w-full h-auto mb-1 rounded-lg shadow-2xl transform transition-transform duration-300 border-2 border-[#000]" 
                      src={images[index].src} 
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt="Bonnie image"
                      style={{ maxWidth: 'calc(100% - 40px)', height: 'auto' }}
                    />
                    <div className="flex items-center justify-center" style={{ width: '400px'}}>
                    <input
                      
                      ref={ref}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      type="text"
                      className="ticketQty w-1/2 p-2 px-4 border-2 border-[#F5F5DC] text-center shadow-lg focus:outline-none bg-[#000] text-white text-3xl font-bold rounded-full"
                      style={{ paddingTop: '12px', paddingBottom: '12px', marginBottom: '8px' } }
                      min={0}
                      attr-yantra= {images[index].name}
                      onChange={(e) => ticketQtychnage(e)}
                    />
                        
                    </div>
                </div>
                </div>
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-grow">
        <div ref={winListEndRef} className="grid grid-cols-6 bg-gray-100 overflow-x-auto mx-auto mt-0  w-full" style={{ height: '450px' }}>
          { (winnerbord.length  > 0)  && (

          winnerbord.map((winer:any,i) => ( 

            <div key={i} className="flex flex-row  items-center justify-between bg-gray-100 border-2 border-black">
              
              <div className="grid text-center justify-center ml-2">
                <span className="text-3xl text-red-700 font-bold">{winer.winner?.join(', ')}</span>
                <span className="text-3xl font-semibold text-black mt-5 mb-5 ">{moment(winer.endTime).format('DD-MM-YYYY')} </span>
                <span className="text-2xl font-semibold text-black ">{moment(winer.endTime).format('hh:mm A')} </span>
              </div>
              <div className="relative">

                  <div className={`flex flex-col items-center `}>
                    {
                    winer.winner?.map((wincard:string, index:number) => {
                      if(index > 0){ return }
                      
                      const imageSrc = images.find((img) => img.name === wincard)?.src;
                      
                      return (
                        <Image
                          key={index}
                          src={ (winer.winner.length == 3) ? "/3dhamaka.png" : ( (winer.winner.length == 2) ? "/2dhamaka.png" : `${imageSrc}`)}
                          alt={`Winner ${index + 1}`}
                          width="0"
                          height="0"
                          sizes="80vw"
                          className="h-auto  object-cover rounded-lg" style={{ width: '220px'}}
                        />
                      );
                    })}
                  </div>
                
                  { ( winer.winnerType  == "2X" || winer.winnerType  == "3X" )  && (
                    <Image
                      src={`/${winer.winnerType}.png`}
                      alt={winer.winnerType}
                      width="0"
                      height="0"
                      sizes="80vw"
                      className="absolute  object-cover w-32 h-auto bottom-0  drop-shadow-lg " style={{ width: '220px'}}
                    />
                  )}
              </div>
            </div>
          ))

        )}
        </div>
      </div>

      {/* Footer */}
      <footer className=" sticky bottom-0 text-white flex flex-col items-center p-4">
        <div className=" w-full flex gap-4 grid grid-cols-7">        
        <button
              key="Cancel"
              disabled={lastOrderID==="" || timeLeft < 20 || isCancellingTicketRef.current}
              onClick={() => handleCancelBtn()}
              className=" px-4 py-4 font-bold text-3xl shadow rounded bg-gradient-to-br from-indigo-600 to-purple-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800"
            >
              {isCancellingTicketRef.current ? "Cancelling..." : "Cancel [F4]"}
            </button>

        <button
              key="Clear"
              disabled={timeLeft < 20}
              onClick={() => handleClearBtn()}
              className=" px-4 py-4 font-bold text-3xl shadow rounded bg-gradient-to-br from-emerald-500 to-teal-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-emerald-200 dark:focus:ring-emerald-800 "
            >
              Clear [F5]
            </button>
            
        <button
          key="Exit"
          onClick={() => handleExitBtn()}
          className=" px-4 py-4 font-bold text-3xl shadow rounded bg-gradient-to-br from-rose-500 to-red-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-rose-200 dark:focus:ring-rose-800"
        >
          Exit
        </button>
        <button
          key="Print"
          disabled={timeLeft < 20 || totalAmt >= balance || isSubmittingTicketRef.current}
          onClick={() => handlePrintBtn()}
          className=" px-4 py-4 font-bold text-3xl shadow rounded bg-gradient-to-br from-amber-500 to-orange-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-amber-200 dark:focus:ring-amber-800"
        >
          {isSubmittingTicketRef.current ? "Processing..." : "Print [F6]"}
        </button>
        <button
          key="Reprint"
          disabled={timeLeft < 20}
          onClick={() => handleReprintBtn()}
          className=" px-4 py-4 font-bold text-3xl shadow rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 "
        >
          Re-Print [F3]
        </button>
        <span className="bg-gradient-to-r text-3xl from-slate-600 to-slate-800 flex shadow h-full font-bold items-center justify-center text-center rounded">{total}</span>

          <span>
          <input
                  ref={ticketInput}
                    placeholder="Ticket" 
                    type="text"
                    className=" w-full h-full p-2 shadow text-3xl font-bold text-center  shadow focus:outline-none bg-gray text-black" style={{ borderRadius: '30px'}}
                    
                    onChange={(e) => ticketNumberchnage(e)}

                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleTicketSubmit(e);
                      }}

                  />
          </span>
        
        </div>
      </footer>
    </div>
  );
}

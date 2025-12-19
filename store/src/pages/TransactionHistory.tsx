import React, { useState, useEffect ,useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/router";

interface Transaction {
  dt: string;
  ar: number;
  ob: number;
  cb: number;
  ap: number;
  aw: number;
  aComm: number;
  aPay: number;
}

const TransactionHistory = () => {

  const [showBal, setShowBal] = useState(1);

  const [_token, setToken] = useState("");
  const _tokenRef = useRef(_token);

    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);


  

  const [totalOB, setTotalOB] = useState(0);
  const [totalAR, setTotalAR] = useState(0);
  const [totalAP, setTotalAP] = useState(0);
  const [totalAW, setTotalAW] = useState(0);
  const [totalAPAY, setTotalAPAY] = useState(0);
  const [totalCB, setTotalCB] = useState(0);
  const [totalAPL, setTotalAPL] = useState(0);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
        const response = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${_tokenRef.current}`,
                "Content-Type": "application/json",
              
            },
            body: JSON.stringify({ page, startDate, endDate}),
          });
    
          const data = await response.json();
          
      setTransactions(data.transactions);

      setTotalOB(data.transactions.reduce((n, {ob}) => n + ob, 0));
      setTotalAR(data.transactions.reduce((n, {ar}) => n + ar, 0));
      setTotalAP(data.transactions.reduce((n, {ap}) => n + ap, 0));
      setTotalAW(data.transactions.reduce((n, {aw}) => n + aw, 0));
      setTotalAPAY(data.transactions.reduce((n, {aPay}) => n + aPay, 0));
      setTotalCB(data.transactions.reduce((n, {cb}) => n + cb, 0));
      setTotalAPL(data.transactions.reduce((n, {ap,aw}) => n + (ap-aw), 0));

      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setToken(token);
    _tokenRef.current =token;

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
        .then((data) => {setBalance(data.user.balance); setUsername(data.user.username) })
        .catch(() => alert("Error fetching data"));
    }
    else {
      router.push("/login"); // Redirect to login if no token
    }
    if(token){
      fetchTransactions(currentPage);
    }
  }, [currentPage,router]); // Only trigger on currentPage changes

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on filtering
    fetchTransactions(1);
  };
  
  if (!username) return <p>Loading...</p>;

  return (
    
    <div className="flex flex-col px-4 bg-gradient-to-r from-[#92B53D] via-[#7a9832] to-[#627a28] animate-gradient-x">
    <ToastContainer />
  <header className="sticky top-0 text-white p-4 pb-2">
    <div className="flex justify-between items-center">
      {/* Left Side - Branding */}
      <div className="flex-1">
        <h1 id="heder1" className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl drop-shadow-2xl" style={{ fontFamily: 'Poppins, Montserrat, Roboto, sans-serif', letterSpacing: '0.02em' }}>
          <span style={{ color: '#5FD4C4', fontWeight: '800' }}>HONEST</span>
          <span style={{ fontSize: '55%', verticalAlign: 'super', fontWeight: '900', marginLeft: '2px', marginRight: '4px', color: '#52a59d' }}>PRO</span>
          <span style={{ fontWeight: '700', color: '#7FE8D8' }}>ONLINE MARKETING</span>
        </h1>
      </div>
      
      {/* Right Side - Buttons */}
      <div className="flex gap-3">
        <button type="button" className="min-w-[180px] text-xl md:text-2xl lg:text-3xl inline-flex items-center justify-center px-6 py-3 font-bold text-white rounded-full transition-all" style={{ backgroundColor: '#103136', border: '3px solid #52a59d', fontFamily: 'Arial, sans-serif' }}>
          ID: {username}
        </button>

        <button 
          type="button" 
          className="min-w-[180px] text-xl md:text-2xl lg:text-3xl inline-flex items-center justify-center px-6 py-3 font-bold text-white rounded-full transition-all"
          style={{ backgroundColor: '#103136', border: '3px solid #52a59d', fontFamily: 'Arial, sans-serif' }}
          onClick={(e) => {setShowBal(showBal==1?0:1);localStorage.setItem("showBal", (showBal==1?"0":"1"));}}
        >
          {showBal?balance:"-"}
        </button>
      </div>
    </div>
  </header>
  <main className="flex-grow p-6">

  <div className="p-6  min-h-screen text-gray-800">
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-700 mb-6">Transaction History</h1>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow mb-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700 w-40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700 w-40"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </form>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <table className="w-full bg-white border-collapse border border-gray-300 shadow rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Opening Balance</th>
                <th className="border border-gray-300 px-4 py-2">Admin Recharge</th>
                <th className="border border-gray-300 px-4 py-2">Agent Purchase</th>
                <th className="border border-gray-300 px-4 py-2">Agent Win</th>
                <th className="border border-gray-300 px-4 py-2">Admin Pay</th>
                <th className="border border-gray-300 px-4 py-2">Closing Balance</th>
                
                
                <th className="border border-gray-300 px-4 py-2">Agent P/L</th>
                
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.dt}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.ob}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.ar}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.ap}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.aw}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.aPay}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.cb}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.ap-transaction.aw}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}

            { transactions.length > 0 && ( 
              <tr className="hover:bg-blue-50"  >
                <td className="border border-gray-300 px-4 py-2 text-center">Total</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalOB}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAR}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAP}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAW}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAPAY}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalCB}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAPL}</td>
                
              </tr>
            ) }

            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mx-auto items-center mt-6 w-2/5">
        <button
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="flex gap-2">
          {Array.from(
            { length: 5 },
            (_, i) =>
              currentPage - 2 + i > 0 &&
              currentPage - 2 + i <= totalPages && (
                <button
                  key={i}
                  onClick={() => handlePageChange(currentPage - 2 + i)}
                  className={`px-4 py-2 rounded ${
                    currentPage === currentPage - 2 + i
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {currentPage - 2 + i}
                </button>
              )
          )}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  
    
    
  </main>
</div>
  );
};

export default TransactionHistory;

import React, { useState, useEffect ,useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/router";
import moment from 'moment';

interface Transaction {
  dt: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
        let body : any = { page, startDate, endDate};
        body[selectedFilter+""] = true;
        const response = await fetch("/api/purchases", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${_tokenRef.current}`,
                "Content-Type": "application/json",
              
            },
            body: JSON.stringify(body),
          });
    
          const data = await response.json();
      setTransactions(data.transactions);
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
        .catch(() => router.push("/login"));
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
    
    <div className="flex flex-col px-4 bg-gradient-to-r from-[#92B53D] via-[#7a9832] to-[#627a28] animate-gradient-x ">
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

      <h1 className="text-2xl font-bold text-gray-700 mb-6">Purchases History</h1>

      {/* Filters */}
    <form
      onSubmit={handleFilter}
      className="flex flex-wrap items-center justify-center gap-4 bg-white p-4 rounded-lg shadow mb-6"
    >
      {/* Start Date Filter */}
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-600">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 text-gray-700 w-40"
        />
      </div>

      {/* End Date Filter */}
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-600">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 text-gray-700 w-40"
        />
      </div>

      {/* Checkbox Filters */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2 mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedFilter === "noTicketWin"}
              onChange={() => setSelectedFilter("noTicketWin")}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 text-sm">No Ticket Win</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedFilter === "completeTicketScan"}
              onChange={() => setSelectedFilter("completeTicketScan")}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 text-sm">Complete Ticket Scan</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedFilter === "ticketWinButNotScan"}
              onChange={() => setSelectedFilter("ticketWinButNotScan")}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 text-sm">Ticket Win But Not Scan</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center w-full">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </form>

      <div className="flex justify-between mx-auto items-center my-6 w-3/5">
      <span className="bg-red-500 text-white text-lg font-bold me-2 px-2.5 py-0.5 rounded dark:bg-red-500 dark:text-white">Ticket Cancel</span>
        <span className="bg-gray-500 text-white text-lg font-bold me-2 px-2.5 py-0.5 rounded dark:bg-gray-500 dark:text-white">No Ticket Win</span>
        <span className="bg-green-500 text-green-800 text-lg font-bold me-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-white">Complete ticket scan</span>
        <span className="bg-blue-500 text-blue-800 text-lg font-bold me-2 px-2.5 py-0.5 rounded dark:bg-blue-500 dark:text-white">Ticket Win But Not Scan</span>

      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <table className="w-full bg-white border-collapse border border-gray-300 shadow rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">SI. No.</th>
                <th className="border border-gray-300 px-4 py-2">Receipt No.</th>
                <th className="border border-gray-300 px-4 py-2">ProgramType</th>
                <th className="border border-gray-300 px-4 py-2">Purchase Time</th>
                <th className="border border-gray-300 px-4 py-2">Draw Time</th>
                <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                <th className="border border-gray-300 px-4 py-2">Draw</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.length > 0 ? (
                transactions.map((transaction:any, index) => (
                  <tr key={index} 
                  className={`${ (transaction?.isCancel == 1 ) ? " bg-red-500 " :(transaction?.isClaimed == 1 ?" bg-green-500 ":(  transaction?.isWinner == true ? " bg-blue-500 " :" bg-gray-500 " ))  }  hover:bg-violet-600`}
                  >
                    
                    <td className="border border-gray-300 px-4 py-2 text-center">{index+1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction?.ticketNo}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.winnerType}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right"> {moment(transaction.createdDate).format('DD-MM-YYYY hh:mm A')}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right"> {moment(transaction.endTime).format('DD-MM-YYYY hh:mm A')}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.totalAmount}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{transaction.winner?.join(', ')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
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

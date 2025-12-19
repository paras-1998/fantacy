import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [showBal, setShowBal] = useState(1);

  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const _showBal = localStorage.getItem("showBal");
    if(_showBal){
      setShowBal(parseInt(_showBal))
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
        .then((data) => {setData(data); setBalance(data.user.balance); setUsername(data.user.username) })
        .catch(() => router.push("/login"));
    }
    else {
      router.push("/login"); // Redirect to login if no token
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Redirect to login after logout
  };
  const navigateToProgram = () => {
    router.push("/program");
  };
  const navigateTochangepass = () => {
    router.push("/ChangePassword");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="flex flex-col px-4 h-screen bg-gradient-to-r from-[#92B53D] via-[#7a9832] to-[#627a28] animate-gradient-x ">
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


      <div className="w-2/5 h-full grid grid-cols-1 md:grid-cols-1 content-center mx-auto justify-center items-center align-middle">
      <button
          onClick={navigateToProgram}
          className="text-white text-4xl font-bold px-6  py-2 my-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg "
        >
          Go to Program 
        </button>
        <button
          onClick={navigateTochangepass }
          className="text-white text-4xl font-bold px-6  py-2 my-2 rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium shadow "
        >
          Change Password
        </button>
        <button
          onClick= { ()=>router.push("/TransactionHistory") }
          className="text-white text-4xl font-bold px-6  py-2 my-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium shadow "
        >
          Transaction History
        </button>
        <button
          onClick= { ()=>router.push("/purchases") }
          className="text-white text-4xl font-bold px-6  py-2 my-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium shadow "
        >
          Purchases History
        </button>
        <button
          onClick={handleLogout}
          className="text-white text-4xl font-bold px-6 py-2 my-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow"
        >
          Logout
        </button>
      </div>
        
        
      </main>
    </div>
  );
}

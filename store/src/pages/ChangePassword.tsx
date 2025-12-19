import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';

const ChangePassword = () => {

  const [showBal, setShowBal] = useState(1);

    const [_token, setToken] = useState("");

    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

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
      setToken(token);
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
}, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/changepassword", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${_token}`,
            "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast("Password changed successfully.");
      } else {
        toast(data.message || "Error changing password.");
      }
    } catch (error) {
        toast("An error occurred. Please try again.");
    }
  };

  if (!username) return <p>Loading...</p>;
  return (
    <div className="flex flex-col px-4 h-screen bg-gradient-to-r from-[#92B53D] via-[#7a9832] to-[#627a28] animate-gradient-x ">
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


      <div className="w-2/5 h-full grid grid-cols-1 md:grid-cols-1 content-center mx-auto justify-center items-center align-middle">
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded w-full px-3 py-2  text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded w-full px-3 py-2  text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input
            
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full px-3 py-2 text-black"
            required
          />
        </div>
        <div className="flex justify-between" >
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
        <button
            onClick= { ()=>router.push("/dashboard") }
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back
        </button>
        </div>
      </form>
    </div>
      </div>
        
        
      </main>
    </div>
  );
};

export default ChangePassword;

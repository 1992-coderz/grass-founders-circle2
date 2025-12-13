import { motion } from "framer-motion";
import cyberMesh from '@assets/generated_images/dark_neon_green_cyber_mesh_background.png';

export function Background() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0a0e27]">
      {/* Base Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url(${cyberMesh})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute rounded-full w-[400px] h-[400px] -top-[100px] -left-[100px] z-10"
        style={{
          background: "radial-gradient(circle, rgba(157, 255, 0, 0.15), transparent)",
        }}
        animate={{
          transform: [
            "translate(0px, 0px) scale(1)",
            "translate(50px, -50px) scale(1.1)",
            "translate(-30px, 30px) scale(0.9)",
            "translate(0px, 0px) scale(1)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
      />
      <motion.div
        className="absolute rounded-full w-[300px] h-[300px] top-[50%] -right-[50px]"
        style={{
          background: "radial-gradient(circle, rgba(157, 255, 0, 0.1), transparent)",
        }}
        animate={{
          transform: [
            "translate(0px, 0px) scale(1)",
            "translate(50px, -50px) scale(1.1)",
            "translate(-30px, 30px) scale(0.9)",
            "translate(0px, 0px) scale(1)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
          times: [0, 0.33, 0.66, 1],
        }}
      />
      <motion.div
        className="absolute rounded-full w-[250px] h-[250px] -bottom-[50px] left-[30%]"
        style={{
          background: "radial-gradient(circle, rgba(157, 255, 0, 0.1), transparent)",
        }}
        animate={{
          transform: [
            "translate(0px, 0px) scale(1)",
            "translate(50px, -50px) scale(1.1)",
            "translate(-30px, 30px) scale(0.9)",
            "translate(0px, 0px) scale(1)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
          times: [0, 0.33, 0.66, 1],
        }}
      />
    </div>
  );
}

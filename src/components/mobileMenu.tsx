"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function MobileMenu() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsVisible((prev) => !prev)}>
        <Menu />
      </Button>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full bg-gray-800 text-white"
        >
          <X className="cursor-pointer" onClick={() => setIsVisible(false)} />
        </motion.div>
      )}
    </div>
  );
}

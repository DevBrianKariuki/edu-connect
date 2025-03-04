
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 1000,
  suffix = ""
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (value <= 0) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="transition-all">
      {count}{suffix}
    </span>
  );
};

export default AnimatedCounter;

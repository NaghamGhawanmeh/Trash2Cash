import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FaTree, FaRecycle, FaTint, FaTruck } from "react-icons/fa";
import "./style.css";

const Counter = ({ endValue, suffix }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000; 
      const increment = Math.ceil(endValue / (duration / 50));

      const counter = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          setCount(endValue);
          clearInterval(counter);
        } else {
          setCount(start);
        }
      }, 50);

      return () => clearInterval(counter);
    }
  }, [inView, endValue]);

  return (
    <div ref={ref} className="counter">
      <h2>{count}{suffix}</h2>
    </div>
  );
};

const CounterSection = () => {
  return (
    <div className="counter-section">
      <div className="counter-box">
        <FaTree className="icon" />
        <Counter endValue={11000} suffix="k" />
        <p>Trees saved</p>
      </div>

      <div className="divider"></div>

      <div className="counter-box">
        <FaRecycle className="icon" />
        <Counter endValue={70} suffix="L" />
        <p>Energy saved</p>
      </div>

      <div className="divider"></div>

      <div className="counter-box">
        <FaTint className="icon" />
        <Counter endValue={1.2} suffix="Cr Gal" />
        <p>Water saved</p>
      </div>

      <div className="divider"></div>

      <div className="counter-box">
        <FaTruck className="icon" />
        <Counter endValue={1.4} suffix="Sq Ft" />
        <p>Landfill Area saved</p>
      </div>
    </div>
  );
};

export default CounterSection;

"use client";

import { useEffect } from "react";

export function ClauseScrollListener() {
  useEffect(() => {
    const handleScroll = (e: CustomEvent<{ clauseOrder: number }>) => {
      const clauseId = `clause-${e.detail.clauseOrder}`;
      const element = document.getElementById(clauseId) as HTMLDetailsElement;
      
      if (element) {
        element.open = true; // Expand the details tag
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Highlight effect
        const originalBg = element.style.backgroundColor;
        element.style.transition = "background-color 0.5s ease";
        element.style.backgroundColor = "rgba(16, 185, 129, 0.1)"; // emerald-500/10
        
        setTimeout(() => {
          element.style.backgroundColor = originalBg;
        }, 2000);
      }
    };

    window.addEventListener("scroll-to-clause" as any, handleScroll);
    return () => window.removeEventListener("scroll-to-clause" as any, handleScroll);
  }, []);

  return null;
}

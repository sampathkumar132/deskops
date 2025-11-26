import React from "react";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 focus:ring-primary-500",
    secondary: "bg-dark-surface hover:bg-dark-border text-slate-200 border border-dark-border focus:ring-slate-500",
    outline: "bg-transparent border border-dark-border text-slate-300 hover:text-white hover:border-slate-400 focus:ring-slate-500",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

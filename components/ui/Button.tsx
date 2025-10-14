import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'default' | 'small';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading = false, variant = 'primary', size = 'default', className, ...props }) => {
    // A more modern, sleek button design. Rounded, clean, with subtle effects.
    const baseClasses = "font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeClasses = {
        default: 'px-8 py-3 text-base',
        small: 'px-5 py-2 text-sm',
    }

    const variantClasses = {
        primary: 'bg-green-500 text-black shadow-lg shadow-green-500/20 hover:bg-green-400 hover:shadow-xl hover:shadow-green-400/30 focus-visible:ring-green-400/50',
        secondary: 'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:border-white/20 focus-visible:ring-white/20 shadow-md shadow-green-500/10 hover:shadow-lg hover:shadow-green-500/20',
    };

    return (
        <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            <span>{children}</span>
        </button>
    );
};
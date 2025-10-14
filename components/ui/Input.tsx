import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    className?: string;
    status?: 'default' | 'success' | 'error';
}

export const Input: React.FC<InputProps> = ({ label, icon, className, status = 'default', ...props }) => {
    const id = React.useId();
    const labelBgColor = '#000000'; // Match the main app background

    const statusClasses = {
        default: 'border-white/10 shadow-sm shadow-green-500/5 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:shadow-lg focus:shadow-green-500/20',
        success: 'border-green-500/80 ring-2 ring-green-500/30 shadow-lg shadow-green-500/30',
        error: 'border-red-500/80 ring-2 ring-red-500/30 shadow-lg shadow-red-500/30',
    };

    const statusLabelClasses = {
        default: 'peer-focus:text-green-400',
        success: 'text-green-400',
        error: 'text-red-400',
    };

    const statusIconClasses = {
        default: 'group-focus-within:text-green-400',
        success: 'text-green-400',
        error: 'text-red-400',
    };

    return (
        <div className="relative group">
            {icon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors ${statusIconClasses[status]}`}>{icon}</div>}
            <input
                id={id}
                className={`peer w-full bg-black/20 border-2 rounded-lg py-3 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${statusClasses[status]} ${icon ? 'pl-10 pr-4' : 'px-4'} ${className}`}
                placeholder={label}
                {...props}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 -top-2.5 text-xs px-1 transition-all
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                           peer-focus:-top-2.5 peer-focus:text-xs 
                           ${statusLabelClasses[status]}`}
                style={{ backgroundColor: labelBgColor }}
            >
                {label}
            </label>
        </div>
    );
};
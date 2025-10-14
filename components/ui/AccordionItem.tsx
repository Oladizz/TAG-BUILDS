import React, { useState } from 'react';

interface AccordionItemProps {
    question: string;
    children: React.ReactNode;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


const AccordionItem: React.FC<AccordionItemProps> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-900/50 border border-white/10 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/5 hover:shadow-green-500/10 hover:border-white/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-6"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-semibold text-white">{question}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="text-gray-400 pb-6 px-6">
                       {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;
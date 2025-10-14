import React from 'react';

const TAGS = [
    'Oladizz.tag',
    'lsr.tag',
    'zencephalon.tag',
    'wilsoncusack.tag',
    'aflock.tag',
    'base.tag',
    'kyra.tag',
    'degen.tag',
    'vitalik.tag',
];

const tagData = TAGS.map((name, index) => ({
    name,
    positionStyle: {
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 90}%`,
        animationDuration: `${12 + Math.random() * 15}s`,
        animationDelay: `${Math.random() * 10}s`,
        animationDirection: index % 2 === 0 ? 'alternate' : 'alternate-reverse',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
    },
    innerStyle: {
        filter: `blur(${1.5 + Math.random() * 4}px)`,
        opacity: 0.1 + Math.random() * 0.1,
        transform: `scale(${0.8 + Math.random() * 0.5})`,
    }
}));


const BackgroundTags: React.FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10" aria-hidden="true">
            {tagData.map(({ name, positionStyle, innerStyle }) => (
                <div key={name} className="absolute animate-float" style={positionStyle}>
                    <div
                        className="whitespace-nowrap text-lg text-gray-200/60 font-medium bg-white/5 rounded-full px-5 py-2.5 border border-white/10"
                        style={innerStyle}
                    >
                        {name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BackgroundTags;
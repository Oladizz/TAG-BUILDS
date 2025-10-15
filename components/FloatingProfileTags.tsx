import React from 'react';

const NEW_IMAGES = [
    'https://i.postimg.cc/G3P8nrDd/IMG-20251015-001839-704.jpg',
    'https://i.postimg.cc/wx5yYHNx/IMG-20251015-001843-944.jpg',
    'https://i.postimg.cc/bJFk5n4X/file-000000003f1061f4a064a5b643579a72.png',
    'https://i.postimg.cc/T24cJsQ1/Laurel-20250605-173322-0001.png',
    'https://i.postimg.cc/02r0sRFx/file-00000000eb2861f68b0dd85470002012-conversation-id-68112840-f334-8011-93b0-4fd58407ac10-amp-message-i.png',
];

const BACKGROUND_PROFILES = [
    {
        name: 'lsr.tag',
        imageUrl: NEW_IMAGES[0],
    },
    {
        name: 'zencephalon.tag',
        imageUrl: NEW_IMAGES[2],
    },
    {
        name: 'kyra.tag',
        imageUrl: NEW_IMAGES[3],
    },
    {
        name: 'aflock.tag',
        imageUrl: NEW_IMAGES[4],
    },
    {
        name: 'vitalik.tag',
        imageUrl: NEW_IMAGES[1],
    },
    {
        name: 'degen.tag',
        imageUrl: NEW_IMAGES[2],
    },
    {
        name: 'base.tag',
        imageUrl: NEW_IMAGES[3],
    }
];

const FOREGROUND_PROFILES = [
    { name: 'builder.tag', imageUrl: NEW_IMAGES[2] },
    { name: 'onchain.tag', imageUrl: NEW_IMAGES[3] },
    { name: 'dev.tag', imageUrl: NEW_IMAGES[4] },
    { name: 'artist.tag', imageUrl: NEW_IMAGES[0] },
];

const generateStyledData = (profiles: typeof BACKGROUND_PROFILES, variant: 'background' | 'foreground') => {
    return profiles.map((profile, index) => {
        const isBackground = variant === 'background';
        return {
            ...profile,
            positionStyle: {
                top: `${10 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 80}%`,
                animationDuration: `${isBackground ? 15 + Math.random() * 20 : 12 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * 15}s`,
                animationDirection: index % 2 === 0 ? 'alternate' : 'alternate-reverse',
            },
            innerStyle: {
                filter: `blur(${isBackground ? 1.5 + Math.random() * 2 : 0.5 + Math.random() * 1}px)`,
                opacity: isBackground ? 0.3 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4,
                transform: `scale(${isBackground ? 0.9 + Math.random() * 0.3 : 0.95 + Math.random() * 0.25})`,
            }
        };
    });
};

const backgroundData = generateStyledData(BACKGROUND_PROFILES, 'background');
const foregroundData = generateStyledData(FOREGROUND_PROFILES, 'foreground');

interface FloatingProfileTagsProps {
    variant?: 'background' | 'foreground';
}

const FloatingProfileTags: React.FC<FloatingProfileTagsProps> = ({ variant = 'background' }) => {
    const dataToRender = variant === 'background' ? backgroundData : foregroundData;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
            {dataToRender.map(({ name, imageUrl, positionStyle, innerStyle }, index) => (
                <div key={`${name}-${index}`} className="absolute animate-float" style={{ ...positionStyle, animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}>
                    <div
                        className="flex items-center space-x-2 whitespace-nowrap text-sm font-medium text-gray-400 bg-white/5 backdrop-blur-sm rounded-full pl-1.5 pr-4 py-1.5 border border-white/10"
                        style={innerStyle}
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <span>{name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloatingProfileTags;
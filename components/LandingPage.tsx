import React, { useState, useRef, useEffect } from 'react';
import { IdentityIcon, SimplifyIcon, ConnectIcon } from './icons/FeatureIcons';
import AccordionItem from './ui/AccordionItem';
import { TagIcon } from './icons/TagIcon';
import { Button } from './ui/Button';

interface LandingPageProps {
    onLaunch: (name?: string) => void;
}

const FAQ_DATA = [
    {
        question: 'What is a TAG ID?',
        answer: 'A TAG ID is your immutable digital identity—a unique, non-transferable onchain identity that verifies your humanity, reputation, and traits while keeping your privacy intact. It’s created through a simple registration and verification flow (voice, fingerprint, and profile setup) and minted directly to your wallet. Once minted, your TAG ID becomes your universal Web3 identity, recognized across integrated platforms, quests, and partner ecosystems.'
    },
    {
        question: 'What are the TAG ID registration fees?',
        answer: 'TAG ID registration fees depend on the length and uniqueness of your .tag name—the shorter its value, the higher the cost. Short names (e.g., yra.tag) are rare and more desirable. During the testnet phase, registration is free; fees will only apply on the mainnet.'
    },
    {
        question: 'How do I get a free or discounted TAG ID?',
        answer: 'You can earn a free or discounted TAG ID through TAG quests, Echo events, or community partnerships. Active participants, early supporters, or top voice earners often receive whitelist spots or bonus mints during special campaign rounds.'
    },
    {
        question: 'How can I use my TAG ID?',
        answer: 'Your TAG ID acts as your digital passport across Web3. You can use it to verify your humanity in DAOs and dApps, earn points and badges in ecosystems, access job boards and reward programs, and log in seamlessly to integrated apps.'
    },
    {
        question: 'Is my profile information published on-chain?',
        answer: 'No, your personal information (like your name, voice, or fingerprint data) is never stored on-chain. TAG only stores hashed or encrypted proofs, ensuring your privacy and security. The public view of your TAG ID only includes traits, badges, and verifications you choose to share.'
    },
    {
        question: 'I am a builder. How do I integrate TAG into my app?',
        answer: 'Builders can integrate TAG through the TAG ID API and Explorer SDK (launching soon). This allows apps to verify user identity, reputation, and humanity without handling sensitive data. Use cases include DAO member verification, anti-sybil filters, and identity-based access systems.'
    },
    {
        question: 'How do I get a TAG ID for my app or project?',
        answer: 'Projects can apply for TAG ID integration or request bulk minting for verified communities. Partnered apps gain access to human-verified user bases, trait analytics, and credential layers. Submit your request through the TAG Partner Form, and our team will guide you through setup on Base.'
    },
    {
        question: 'Can I sell or transfer my TAG ID?',
        answer: 'Your TAG ID is a non-transferable, immutable digital ID, permanently bound to you. This ensures authenticity, integrity, and accountability across the ecosystem. Your TAG ID represents your verified digital identity, not a tradable asset.'
    }
];

// Custom hook to trigger animations on scroll
const useAnimateOnScroll = (options?: IntersectionObserverInit) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, {
            threshold: 0.1,
            ...options
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
    const [name, setName] = useState('');

    const [heroRef, isHeroVisible] = useAnimateOnScroll();
    const [featuresRef, isFeaturesVisible] = useAnimateOnScroll();
    const [decentralizedRef, isDecentralizedVisible] = useAnimateOnScroll();
    const [faqRef, isFaqVisible] = useAnimateOnScroll();
    const [footerRef, isFooterVisible] = useAnimateOnScroll();

    const handleStart = () => {
        onLaunch(name);
    };

    return (
        <div className="h-full w-full bg-black text-gray-300 overflow-y-auto custom-scrollbar selection:bg-green-500/30">
            {/* Header */}
            <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 bg-black/70 backdrop-blur-lg border-b border-white/10 animate-fade-in">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                         <TagIcon className="w-8 h-8 rounded-md" />
                         <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300">
                           TAG
                         </span>
                    </div>
                    <Button onClick={() => onLaunch()} size="small">Launch App</Button>
                </div>
            </header>

            {/* Hero Section */}
            <main ref={heroRef} className={`relative isolate overflow-hidden transition-opacity duration-700 ${isHeroVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
                <div className="relative z-10 max-w-4xl mx-auto text-center py-24 sm:py-32 px-4">
                    <div className="inline-flex items-center space-x-2 text-sm font-medium mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span className="font-bold text-white">TAG ID</span>
                        <span className="text-gray-400">Your immutable Digital identity</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Your Digital Identity, Reimagined.
                    </h1>
                    <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
                        Mint a unique .tag to build reputations,create and connect.
                    </p>
                    <div className="mt-10">
                         <div className="flex items-center w-full max-w-lg mx-auto bg-white/5 border border-white/10 rounded-full shadow-lg shadow-green-500/10 focus-within:ring-2 focus-within:ring-green-500/50 transition-all p-2">
                            <input
                                type="text"
                                placeholder="your-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                                className="w-full text-lg font-medium tracking-wider bg-transparent py-2 px-6 text-white placeholder-gray-500 focus:outline-none"
                            />
                            <span className="text-lg font-medium text-gray-500 pr-4">.tag</span>
                            <Button onClick={handleStart} disabled={!name} className="py-2.5 px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap">
                                Claim My .tag
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section ref={featuresRef} className={`py-16 sm:py-24 bg-black/20 border-y border-white/5 transition-opacity duration-700 ${isFeaturesVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Everything starts with your TAG ID
                        </h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 shadow-xl shadow-green-500/10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border-2 border-blue-400 flex items-center justify-center text-blue-300">
                                <IdentityIcon className="w-8 h-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">Build your onchain identity</h3>
                            <p className="mt-2 text-gray-400">Use your TAG ID as your verified onchain identity across the Base ecosystem and beyond.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 shadow-xl shadow-green-500/10">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border-2 border-green-400 flex items-center justify-center text-green-300">
                                <SimplifyIcon className="w-8 h-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">Own your onchain domain</h3>
                            <p className="mt-2 text-gray-400">Get a personalized web address yourname.tag.id that links directly to your verified TAG profile.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 shadow-xl shadow-green-500/10">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border-2 border-purple-400 flex items-center justify-center text-purple-300">
                                <ConnectIcon className="w-8 h-8" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">Connect and collaborate</h3>
                            <p className="mt-2 text-gray-400">Find and interact with builders, creators, and communities across ecosystems through verified TAG IDs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decentralized Section */}
            <section ref={decentralizedRef} className={`py-16 sm:py-24 transition-opacity duration-700 ${isDecentralizedVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Decentralized and verifiable
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Tag IDs are built on the decentralized TAG protocol, enabling secure, verifiable identities providing ownership of digital identity and trust ready verification via ID explorer.
                    </p>

                    <div className="relative h-80 flex items-center justify-center mt-12">
                        {/* Decorative floating circles */}
                        <div className="absolute w-12 h-12 bg-green-500/20 rounded-full animate-float blur-sm" style={{ top: '10%', left: '20%', animationDuration: '8s', animationDelay: '0.5s' }}></div>
                        <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-float" style={{ top: '25%', left: '80%', animationDuration: '12s', animationDelay: '1s' }}></div>
                        <div className="absolute w-16 h-16 bg-gray-400/20 rounded-full animate-float blur-sm" style={{ top: '70%', left: '10%', animationDuration: '10s', animationDelay: '2s' }}></div>
                        <div className="absolute w-10 h-10 bg-pink-400/20 rounded-full animate-float" style={{ bottom: '15%', right: '15%', animationDuration: '9s', animationDelay: '1.5s' }}></div>
                        <div className="absolute w-20 h-20 bg-blue-400/20 rounded-full animate-float blur-md" style={{ bottom: '20%', left: '30%', animationDuration: '15s', animationDelay: '3s' }}></div>
            
                        {/* Main floating logo */}
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 animate-float" style={{ animationDuration: '7s' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-blue-500/50 rounded-full blur-2xl"></div>
                            <div className="relative w-full h-full p-2 bg-black/30 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl shadow-green-500/20">
                                <TagIcon className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section ref={faqRef} className={`py-16 sm:py-24 transition-opacity duration-700 ${isFaqVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Questions? See our FAQ
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Get more answers in our FAQ, and view our developer docs to see how you can build with TAG.
                        </p>
                    </div>
                    <div className="mt-12 space-y-4">
                        {FAQ_DATA.map((item, index) => (
                            <AccordionItem key={index} question={item.question}>
                                {item.answer}
                            </AccordionItem>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer ref={footerRef} className={`py-8 border-t border-white/10 transition-opacity duration-700 ${isFooterVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} TAG Protocol. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
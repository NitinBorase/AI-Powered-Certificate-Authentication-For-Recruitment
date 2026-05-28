import React, { useEffect } from 'react';
import { ShieldCheck, Users, Briefcase, Zap, Globe, QrCode, Link as LinkIcon, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        title: "Recruiters",
        subtitle: "Verified Candidate Resumes",
        description: "Access a pool of candidates whose certificates are authenticated using our AI engine, reducing screening time and eliminating fraud.",
        icon: Users,
        color: "text-blue-600",
        shadow: "shadow-blue-200"
    },
    {
        title: "Job Seekers",
        subtitle: "Verified Profile Badges",
        description: "Receive an official verified badge on your professional profile upon certificate authentication, boosting trust and visibility.",
        icon: Briefcase,
        color: "text-red-600",
        shadow: "shadow-red-200"
    },
    {
        title: "Issuers",
        subtitle: "Recruiter Trust and Integration",
        description: "Seamlessly issue cryptographically verified certificates, establishing trust with recruiters and enhancing the value of your credentials.",
        icon: ShieldCheck,
        color: "text-green-600",
        shadow: "shadow-green-200"
    },
];

const useAnimateOnScroll = () => {
    useEffect(() => {
        const elements = document.querySelectorAll('.animate-fade-in');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
        });

        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
};

const FeatureCard = ({ title, subtitle, description, icon: Icon, color, shadow, delay }) => (
    <div
        className={`w-full md:w-1/3 p-4 animate-fade-in transition duration-700 ease-out`}
        style={{ '--delay': `${delay}ms` }}
    >
        <div className={`p-8 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl ${shadow} transition transform hover:-translate-y-1 duration-300`}>
            <div className={`mb-4 w-12 h-12 p-3 rounded-full bg-opacity-10 ${color} bg-current`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h4 className="text-2xl font-bold text-gray-800">{title}</h4>
            <h5 className="text-lg font-semibold text-gray-600 mt-1">{subtitle}</h5>
            <p className="text-gray-500 mt-3">{description}</p>
        </div>
    </div>
);

const App = () => {
    useAnimateOnScroll();

    return (
        <div className="w-full min-h-screen bg-gray-50 font-sans">
            <style>{`
                .animate-fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.7s, transform 0.7s;
                    transition-delay: var(--delay);
                }
                .animate-fade-in.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            <nav className="w-full bg-blue-800 shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-10">
                <h1 className="text-xl font-bold text-white tracking-wider">AI-CertiAuth</h1>
                <div className="space-x-6 hidden sm:flex">
                    <Link to={"/about"} className="text-gray-200 hover:text-white transition duration-200">About</Link>
                    <Link to={"/feature"} className="text-gray-200 hover:text-white transition duration-200">Features</Link>
                    <Link to={"/"} className="text-gray-200 hover:text-white transition duration-200">Contact</Link>
                    <Link to={"/login"} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition duration-200">Login/Register</Link>
                </div>

                <button className="sm:hidden text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </nav>
            <div className="pt-16"></div>

            <section id="about" className="text-center py-20 px-6 bg-white max-w-7xl mx-auto rounded-xl shadow-inner my-8 animate-fade-in" style={{ '--delay': '0ms' }}>
                <div className="flex justify-center items-center mb-4">
                    <Zap className="w-8 h-8 text-blue-600 mr-2" />
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800">
                        AI Powered Certificate Authentication
                    </h2>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2 tracking-wide">
                    Authenticity Meets Opportunity.
                </h3>
                <p className="text-lg text-gray-600 mt-5 max-w-3xl mx-auto">
                    Transforming recruitment with verifiable credentials. We provide the industry's most robust platform for eliminating document fraud and securing career paths.
                </p>
                <div className="mt-8">
                    <a href="#features" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-xl">
                        Explore Features
                    </a>
                </div>
            </section>

            {/* --- HOW WE VERIFY CERTIFICATES SECTION --- */}
            <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 my-12">
                <div className="text-center mb-16 animate-fade-in" style={{ '--delay': '100ms' }}>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
                        How We Verify Your Certificates
                    </h3>
                    <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
                        Our multi-layered AI verification infrastructure uses three robust automated pathways to authenticate credentials.
                    </p>
                </div>

                {/* Horizontal Steps Layout */}
                <div className="flex flex-col md:flex-row justify-between items-stretch gap-8">

                    {/* Step 1: QR Code */}
                    <div className="flex-1 p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 animate-fade-in" style={{ '--delay': '200ms' }}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Path A</span>
                                <h4 className="text-xl font-bold text-gray-800">Instant QR Decoding</h4>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Our scanning parser isolates embedded micro-QR graphics instantly to read encrypted endpoint security markers, checking authenticity in milliseconds.
                        </p>
                    </div>

                    {/* Step 2: Live URL Web Scraping */}
                    <div className="flex-1 p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 animate-fade-in" style={{ '--delay': '400ms' }}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <LinkIcon className="w-6 h-6" /> {/* 🌟 Changed from Link to LinkIcon here */}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-red-600 tracking-wider uppercase">Path B</span>
                                <h4 className="text-xl font-bold text-gray-800">Live URL Scraping</h4>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            If no QR code is found, our system locates printed URLs on the page, using automated backend browser actions to check live metadata configurations at the origin site.
                        </p>
                    </div>

                    {/* Step 3: Cryptographic Ledger Check */}
                    <div className="flex-1 p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 animate-fade-in" style={{ '--delay': '600ms' }}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-green-600 tracking-wider uppercase">Path C</span>
                                <h4 className="text-xl font-bold text-gray-800">Global Registry Match</h4>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            For flat uploads, we extract text structures via PDF streams to generate a secure SHA-256 cryptographic hash fingerprint, cross-referencing against our central database records.
                        </p>
                    </div>

                </div>
            </section>

            <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
                <h3 className="text-3xl font-bold text-gray-800 text-center mb-12 animate-fade-in" style={{ '--delay': '100ms' }}>
                    What We Provide to Our Users
                </h3>
                <div className="flex flex-wrap -mx-4 justify-center">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            delay={200 + index * 200}
                        />
                    ))}
                </div>
            </section>

            <section id="contact" className="text-center py-16 bg-blue-700 text-white shadow-2xl mt-10">
                <h3 className="text-3xl sm:text-4xl font-bold animate-fade-in" style={{ '--delay': '0ms' }}>
                    Start Securing Your Future Today!
                </h3>
                <p className="text-lg mt-4 animate-fade-in" style={{ '--delay': '200ms' }}>
                    Join the verified network and unlock a world of trust and opportunity.
                </p>
                <div className="mt-8 animate-fade-in" style={{ '--delay': '400ms' }}>
                    <a href="#login" className="bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
                        Register Now
                    </a>
                </div>
            </section>

            <footer className="text-center py-4 bg-blue-900 text-gray-300 text-sm">
                <p>@AI-CertiAuth all rights reserved | <Globe className="w-4 h-4 inline mr-1" /> Built on Trust</p>
            </footer>
        </div>
    );
};

export default App;
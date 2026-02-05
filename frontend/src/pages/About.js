import React from 'react';
import { Target, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';


const Header = () => (
    <header className="bg-white text-blue-800 shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
            <nav>
                <ul className="flex space-x-6 text-sm font-medium">
                    <li><Link to={"/feature"} className="hover:text-red-700 transition">Features</Link></li>
                    <li><Link to={"/login"} className="font-semibold hover:text-red-700 transition">Login/Register</Link></li>
                    <li><Link to={"/"} className="hover:text-red-700 transition">Contact</Link></li>
                </ul>
            </nav>
        </div>
    </header>
);

const AboutContent = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-xl mt-10 mb-16">
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            About:
        </h2>

        <div className="mb-10">
            <h3 className="flex items-center text-xl sm:text-2xl font-extrabold text-blue-800 mb-4">
                <MessageSquare className="w-6 h-6 mr-3 text-red-700" />
                Problem Statement that we recognized:
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed pl-3 border-l-4 border-red-300">
                Design and develop an **AI-powered Certificate Authentication System** using blockchain technology, capable of verifying the authenticity of applicant certificates through **QR codes, embedded links, and decentralized validation mechanisms** to ensure secure, transparent, and **tamper-proof recruitment processes.**
            </p>
        </div>

        <div className="mb-10">
            <h3 className="flex items-center text-xl sm:text-2xl font-extrabold text-blue-800 mb-6">
                <Target className="w-6 h-6 mr-3 text-red-700" />
                Objectives:
            </h3>

            <ol className="space-y-6 list-none">
                <li className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                    <span className="font-bold text-blue-700 mr-2">1.</span> 
                    <p className="inline text-gray-700">
                        To develop an **AI-powered certificate authentication system** that can validate the authenticity of submitted certificates through **QR codes, embedded links, and by blockchain integration**. This will ensure that only genuine documents are accepted during the recruitment process.
                    </p>
                </li>

                <li className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                    <span className="font-bold text-blue-700 mr-2">2.</span> 
                    <p className="inline text-gray-700">
                        To build a **secure and decentralized certificate repository** using blockchain technology where verified certificates can be stored, shared and accessed transparently by recruiters and organizations. This repository will eliminate risk of certificate duplication and provide a **single source of truth.**
                    </p>
                </li>
            </ol>
        </div>

        <div className="mt-12 text-center">
            <p className="text-3xl font-extrabold text-red-700 tracking-wider">
                Authenticity Meets Opportunity.
            </p>
        </div>
    </div>
);

const Footer = () => (
    <footer className="bg-blue-800 text-gray-300 py-4 text-center text-sm font-semibold">
        <p>@AI-CertiAuth all rights reserved</p>
    </footer>
);



const App = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow p-4">
                <AboutContent />
            </main>
            <Footer />
        </div>
    );
};

export default App;

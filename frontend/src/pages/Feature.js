import React, { useState } from 'react';
import { 
    Mail, Lock, User, Building, Landmark, LogIn, Key, Briefcase, Hash,
    ShieldCheck, Zap, Layers, BriefcaseBusiness, School, QrCode, Globe, HardHat 
} from 'lucide-react';

// The following Firebase-related variables and logic are intentionally commented out 
// or removed to adhere to the request of removing Firebase dependencies.

/*
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Removed Firebase initialization logic
*/

// --- Shared Components ---

const Header = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { name: 'Features', icon: Zap, key: 'Features' },
        { name: 'Register', icon: LogIn, key: 'Registration' },
    ];

    return (
        <header className="bg-blue-800 text-white shadow-lg p-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-wider cursor-pointer" onClick={() => setCurrentPage('Features')}>AI-CertiAuth</h1>
                <nav>
                    <ul className="flex space-x-4 sm:space-x-6 text-sm font-medium">
                        {navItems.map(item => (
                            <li key={item.key}>
                                <button
                                    onClick={() => setCurrentPage(item.key)}
                                    className={`flex items-center space-x-1 p-2 rounded-lg transition-colors duration-200 
                                        ${currentPage === item.key 
                                            ? 'bg-blue-900 text-yellow-300' 
                                            : 'hover:text-yellow-300 hover:bg-blue-700'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-blue-900 text-gray-300 py-4 text-center text-sm font-semibold mt-auto">
        <div className="text-xl font-bold text-red-600 mb-2">Authenticity Meets Opportunity.</div>
        <p>© AI-CertiAuth all rights reserved</p>
    </footer>
);


// --- Features Page Component ---

const FeatureCard = ({ title, description, icon: Icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-xl transition-transform transform hover:scale-[1.02] bg-white border-b-4 border-${color}-600`}>
        <div className={`p-3 inline-flex rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-base">{description}</p>
    </div>
);

// FIX: Added { setCurrentPage } as a prop
const FeaturesPage = ({ setCurrentPage }) => {
    const features = [
        {
            title: "AI-Powered Verification",
            description: "Leverage advanced AI algorithms to instantly verify the authenticity of all submitted credentials, drastically reducing fraud and verification time.",
            icon: ShieldCheck,
            color: "green"
        },
        {
            title: "Immutable Blockchain Ledger",
            description: "All issued credentials are recorded on a secure, public blockchain, ensuring data integrity, tamper-resistance, and permanent history.",
            icon: Layers,
            color: "blue"
        },
        {
            title: "Multi-Role Access Control",
            description: "Tailored dashboards and functionalities for Applicants, Employers, and Institutions, streamlining credential management across the entire ecosystem.",
            icon: Globe,
            color: "indigo"
        },
        {
            title: "Instant Credential Lookup",
            description: "Employers can perform one-click verification using a unique hash or QR code, receiving instant, trustworthy authentication results.",
            icon: QrCode,
            color: "red"
        },
        {
            title: "Digital Certificate Issuance",
            description: "Institutions can issue cryptographically signed, verifiable digital certificates directly to the applicant's secure wallet.",
            icon: School,
            color: "yellow"
        },
        {
            title: "Professional Skills Register",
            description: "Applicants can build a verifiable portfolio of professional experience and skill endorsements from former employers.",
            icon: HardHat,
            color: "pink"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 sm:p-10">
            <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-4">Core Platform Features</h2>
            <p className="text-center text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                AI-CertiAuth is built on the pillars of **Trust, Speed, and Integrity**, combining cutting-edge AI verification with secure blockchain technology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to experience true authenticity?</h3>
                <button 
                    onClick={() => setCurrentPage('Registration')}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 transition duration-300 transform hover:scale-105"
                >
                    <BriefcaseBusiness className="w-6 h-6 mr-3" />
                    Join the Certified Network
                </button>
            </div>
        </div>
    );
};


// --- Registration Page (Renamed and simplified for context) ---

const RoleSelector = ({ role, setRole }) => {
    const roles = [
        { key: 'Applicant', icon: User },
        { key: 'Employer', icon: Building },
        { key: 'Institution', icon: Landmark }
    ];

    return (
        <div className="flex justify-between w-full mb-8 space-x-2">
            {roles.map((r) => (
                <button
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-300 w-1/3 text-center border-2 
                        ${role === r.key 
                            ? 'bg-blue-800 border-blue-900 text-white shadow-lg scale-105' 
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <r.icon className="w-5 h-5 mb-1 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm font-semibold">{r.key}</span>
                </button>
            ))}
        </div>
    );
};

const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, icon: Icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} :</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const FormButton = ({ loading }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center bg-blue-800 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-900 transition duration-200 disabled:opacity-50"
    >
        {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <><LogIn className="w-5 h-5 mr-2" /> Register</>
        )}
    </button>
);

const ApplicantForm = ({ setLoading, setMessage, loading }) => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (formData.password !== formData.confirmPassword) {
                setMessage('Error: Passwords do not match.');
            } else if (formData.email && formData.password) {
                setMessage('Applicant Registration successful! Proceed to login.');
                console.log('Applicant Registration Data:', formData);
            } else {
                setMessage('Please fill in all required fields.');
            }
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="Email" type="email" icon={Mail} name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
            <FormInput label="Password" type="password" icon={Lock} name="password" value={formData.password} onChange={handleChange} placeholder="********" />
            <FormInput label="Confirm Password" type="password" icon={Key} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="********" />
            <FormButton loading={loading} />
        </form>
    );
};

const EmployerForm = ({ setLoading, setMessage, loading }) => {
    const [formData, setFormData] = useState({ orgName: '', email: '', password: '', confirmPassword: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (formData.password !== formData.confirmPassword) {
                setMessage('Error: Passwords do not match.');
            } else if (formData.email && formData.password && formData.orgName) {
                setMessage('Employer Registration successful! Proceed to login.');
                console.log('Employer Registration Data:', formData);
            } else {
                setMessage('Please fill in all required fields.');
            }
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="Organization/Company Name" type="text" icon={Briefcase} name="orgName" value={formData.orgName} onChange={handleChange} placeholder="Tech Solutions Inc." />
            <FormInput label="Email" type="email" icon={Mail} name="email" value={formData.email} onChange={handleChange} placeholder="hr@techsolutions.com" />
            <FormInput label="Password" type="password" icon={Lock} name="password" value={formData.password} onChange={handleChange} placeholder="********" />
            <FormInput label="Confirm Password" type="password" icon={Key} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="********" />
            <FormButton loading={loading} />
        </form>
    );
};

const InstitutionForm = ({ setLoading, setMessage, loading }) => {
    const [formData, setFormData] = useState({ instName: '', email: '', password: '', confirmPassword: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (formData.password !== formData.confirmPassword) {
                setMessage('Error: Passwords do not match.');
            } else if (formData.email && formData.password && formData.instName) {
                setMessage('Institution Registration successful! Proceed to login.');
                console.log('Institution Registration Data:', formData);
            } else {
                setMessage('Please fill in all required fields.');
            }
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="Institution Name" type="text" icon={Hash} name="instName" value={formData.instName} onChange={handleChange} placeholder="University of Science" />
            <FormInput label="Email" type="email" icon={Mail} name="email" value={formData.email} onChange={handleChange} placeholder="registrar@uni.edu" />
            <FormInput label="Password" type="password" icon={Lock} name="password" value={formData.password} onChange={handleChange} placeholder="********" />
            <FormInput label="Confirm Password" type="password" icon={Key} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="********" />
            <FormButton loading={loading} />
        </form>
    );
};


const RegistrationPage = ({ setCurrentPage }) => {
    const [role, setRole] = useState('Applicant'); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const renderForm = () => {
        const formProps = { setLoading, setMessage, loading };
        switch (role) {
            case 'Applicant':
                return <ApplicantForm {...formProps} />;
            case 'Employer':
                return <EmployerForm {...formProps} />;
            case 'Institution':
                return <InstitutionForm {...formProps} />;
            default:
                return <ApplicantForm {...formProps} />;
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 sm:p-10 bg-gray-200 rounded-3xl shadow-2xl border-4 border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h2>
                
                <RoleSelector role={role} setRole={setRole} />
                
                {renderForm()}
                
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account? <a href="#login" className="text-blue-700 hover:text-blue-900 font-bold transition">Login</a>
                    </p>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm text-center font-medium mt-4 ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main App Component (Routing Logic) ---

const App = () => {
    // State for simple routing: 'Features' or 'Registration'
    const [currentPage, setCurrentPage] = useState('Features');

    const renderPage = () => {
        switch (currentPage) {
            case 'Features':
                // Passing setCurrentPage allows the FeatureCard to link to registration
                return <FeaturesPage setCurrentPage={setCurrentPage} />;
            case 'Registration':
                return <RegistrationPage setCurrentPage={setCurrentPage} />;
            default:
                return <FeaturesPage setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-100">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;

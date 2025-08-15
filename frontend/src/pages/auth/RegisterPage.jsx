import { useState } from 'react';
import { Loader, Mail, User, Lock, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();
    const { register, error, isLoading } = useAuthStore();

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '' };

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        const text = strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : strength === 4 ? 'Strong' : '';
        return { strength, text };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSignUp = async (e) => {
        e.preventDefault();

        const namePattern = /^[a-zA-Z\s]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        // Validate name
        if (!namePattern.test(name)) {
            setNameError('Name can only contain letters and spaces');
            return;
        } else {
            setNameError('');
        }

        // Validate email
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            return;
        } else {
            setEmailError('');
        }

        // Validate password
        if (!passwordPattern.test(password)) {
            setPasswordError('Password must be at least 8 characters with letters, numbers, and special characters');
            return;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            await register(email, password, name);
            navigate("/chat");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
                <h1 className="text-2xl font-semibold text-center mb-6">Create Account</h1>

                <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Full Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={`w-full pl-10 pr-4 py-2.5 border ${nameError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="John Doe"
                            />
                        </div>
                        {nameError && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {nameError}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full pl-10 pr-4 py-2.5 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="name@example.com"
                            />
                        </div>
                        {emailError && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {emailError}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`w-full pl-10 pr-10 py-2.5 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password strength indicator */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex space-x-1 w-full">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 w-1/4 rounded-full ${passwordStrength.strength >= level
                                                        ? level === 1
                                                            ? 'bg-red-500'
                                                            : level === 2
                                                                ? 'bg-yellow-500'
                                                                : level === 3
                                                                    ? 'bg-green-400'
                                                                    : 'bg-green-600'
                                                        : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-medium ml-2 ${passwordStrength.strength === 1
                                            ? 'text-red-500'
                                            : passwordStrength.strength === 2
                                                ? 'text-yellow-500'
                                                : passwordStrength.strength >= 3
                                                    ? 'text-green-500'
                                                    : 'text-gray-400'
                                        }`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className={`w-full pl-10 pr-10 py-2.5 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {/* General Error */}
                    {error && (
                        <div className="flex items-center p-3 text-sm text-red-800 bg-red-50 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center mt-4"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" size={18} />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="ml-2" size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
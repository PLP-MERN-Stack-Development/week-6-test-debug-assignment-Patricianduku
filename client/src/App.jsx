import React, { useState, useEffect } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import { Toaster } from 'react-hot-toast';
import { FaSun, FaMoon } from 'react-icons/fa';

// Add Google Fonts link to the document head
if (typeof document !== 'undefined' && !document.getElementById('google-font-inter')) {
    const link = document.createElement('link');
    link.id = 'google-font-inter';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    document.head.appendChild(link);
}

const App = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
            <Toaster position="top-right" />
            <header className="bg-blue-600 dark:bg-gray-800 shadow mb-8">
                <div className="container mx-auto px-2 sm:px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight font-sans text-center sm:text-left">🐞 Bug Tracker</h1>
                    <nav className="flex items-center gap-4 mt-2 sm:mt-0">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors duration-200"
                            data-testid="dark-mode-toggle"
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex-1 w-full max-w-3xl">
                <BugForm />
                <section className="mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight leading-snug font-sans flex items-center gap-2">
                        <span className="flex-shrink-0 w-1 h-6 bg-green-500 rounded-full mr-2"></span>
                        Bug List
                    </h2>
                    <hr className="mb-4 border-green-200 dark:border-green-800" />
                    <BugList />
                </section>
            </main>
            <footer className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-center py-4 mt-8 border-t border-gray-200 dark:border-gray-700 text-sm sm:text-base">
                &copy; {new Date().getFullYear()} Patricia Nduku. All rights reserved.
            </footer>
        </div>
    );
};

export default App;
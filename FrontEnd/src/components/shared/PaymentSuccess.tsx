import React from 'react';

interface PaymentSuccessProps {
    planName: string;
    onGoBack: () => void;
    onGoHome: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ planName, onGoBack, onGoHome }) => (
    <div className="text-center">

        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 mx-auto text-green-500 animate-bounce-slow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>

        <h1 className="text-4xl font-extrabold text-gray-800 mt-4">
            Payment Successful!
        </h1>

        <p className="text-lg text-gray-600 mt-3">
            Thank you for subscribing to the **{planName}**.
        </p>

        <p className="text-sm text-gray-500 mt-2">
            Your account is now fully activated.
        </p>

        <div className="flex flex-col space-y-3 mt-8">

            <button
                onClick={onGoHome}
                className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                Go to Home
            </button>

            <button
                onClick={onGoBack}
                className="py-3 px-6 bg-white text-green-600 border border-green-600 font-semibold rounded-lg shadow-sm hover:bg-green-50 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                Go Back to Previous Page
            </button>

        </div>
    </div>
);

export default PaymentSuccess;
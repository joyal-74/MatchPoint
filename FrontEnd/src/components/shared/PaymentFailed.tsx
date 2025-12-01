import React from 'react';

interface PaymentFailedProps {
    planName: string;
    onGoBack: () => void;
    onGoHome: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ planName, onGoBack, onGoHome }) => (
    <div className="text-center">

        {/* SVG Failure Icon (X Mark) */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 mx-auto text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>

        <h1 className="text-4xl font-extrabold text-gray-800 mt-4">
            Payment Failed
        </h1>

        <p className="text-lg text-gray-600 mt-3">
            We couldn't process your payment for the **{planName}**.
        </p>

        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Possible Reasons:</p>
            <ul className="list-disc list-inside text-left ml-4 text-sm mt-1">
                <li>Insufficient funds.</li>
                <li>Card expiration or incorrect details.</li>
                <li>Transaction blocked by your bank.</li>
            </ul>
        </div>


        <div className="flex flex-col space-y-3 mt-8">

            {/* Try Again / Go Back Button */}
            <button
                onClick={onGoBack}
                className="py-3 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                Try Payment Again
            </button>

            {/* Contact Support/Go Home Button */}
            <button
                onClick={onGoHome} // Could also link to a "Contact Support" page
                className="py-3 px-6 bg-white text-red-600 border border-red-600 font-semibold rounded-lg shadow-sm hover:bg-red-50 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                Go to Home
            </button>

        </div>
    </div>
);

export default PaymentFailed;
import React from 'react'

interface otpInterface {
    otp: string,
    setOtp: React.Dispatch<React.SetStateAction<string>>;
}

const OtpVerify: React.FC<otpInterface> = ({otp, setOtp}) => {
    return (
        <>
            <div className="flex flex-col text-sm max-w-xs w-full mx-auto">
                <label htmlFor="otp" className="text-sm text-center mb-1">
                    One-Time Password
                </label>
                <input
                    id="otp"
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-md tracking-widest text-center text-lg font-bold bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
                <h1 className="text-center text-sm text-[var(--color-error-text)]">0:00</h1>
            </div>

        </>
    )
}

export default OtpVerify
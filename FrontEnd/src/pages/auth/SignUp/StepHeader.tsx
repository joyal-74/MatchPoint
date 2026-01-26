const StepHeader = ({ step }: { step: number }) => (
    <header className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-foreground">
            {step === 1 ? "Profile Identity" : step === 2 ? "Technical Stats" : "Secure Account"}
        </h2>
        <p className="text-muted-foreground text-sm">Fill in your professional details.</p>
    </header>
);

export default StepHeader;
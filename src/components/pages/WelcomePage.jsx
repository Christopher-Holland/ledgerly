import { useEffect, useState } from "react";

const WelcomePage = ({ onComplete }) => {
    const [headText, setHeadText] = useState("");
    const [subText, setSubText] = useState("");
    const headerText = "HELLO AND WELCOME TO LEDGERLY.";
    const subHeadText = "Your Personal Finance Tracker.\nLet's Get Started!";

    useEffect(() => {
        let headIndex = 0;
        let subIndex = 0;
        let subInterval;

        const interval = setInterval(() => {
            setHeadText(headerText.substring(0, headIndex));
            headIndex++;
            if (headIndex > headerText.length) {
                clearInterval(interval);
                subInterval = setInterval(() => {
                    setSubText(subHeadText.substring(0, subIndex));
                    subIndex++;
                    if (subIndex > subHeadText.length) {
                        clearInterval(subInterval);
                        setTimeout(() => onComplete(), 1000);
                    }
                }, 100);
            }
        }, 100);

        return () => {
            clearInterval(interval);
            if (subInterval) clearInterval(subInterval);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[var(--color-bg-gradient)]" />

            {/* Radial glow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-overlay),transparent_70%)]" />

            <h1 className="fixed top-10 logo">ledgerly</h1>

            {/* Text block */}
            <div className="relative flex flex-col items-center z-10">
                <div className="mb-4 text-4xl font-mono font-bold text-[var(--color-text-primary)]">
                    {headText} <span className="animate-blink ml-1"> | </span>
                </div>

                <div className="mt-2 text-2xl font-mono text-[var(--color-cyan)] whitespace-pre-wrap">
                    {subText}
                    {subText && <span className="animate-blink ml-1">|</span>}
                </div>
            </div>

            {/* Loading bar pinned to bottom */}
            <div className="absolute bottom-10 w-[500px] h-[3px] bg-[var(--color-card-bg)] rounded overflow-hidden z-10">
                <div
                    className="w-[40%] h-full animate-loading-bar"
                    style={{
                        backgroundColor: "var(--color-cyan)",
                        boxShadow: "0 0 15px var(--color-cyan-shadow)",
                    }}
                />
            </div>
        </div>
    );
};

export default WelcomePage;
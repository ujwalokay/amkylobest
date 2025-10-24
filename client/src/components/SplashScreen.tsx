import { useEffect, useState } from "react";
import logoImage from "../assets/logo.png";
import gamingIconsPattern from "../assets/gaming-icons-pattern.jpg";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const newProgress = oldProgress + 2;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 40);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
      data-testid="splash-screen"
    >
      <div
        className="absolute inset-0 opacity-20 scroll-bg"
        style={{
          backgroundImage: `url(${gamingIconsPattern})`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
        <div className="fade-in-scale">
          <img
            src={logoImage}
            alt="Airavoto Gaming Logo"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>

        <h1
          className="text-3xl md:text-5xl font-bold tracking-wider shimmer-text"
          style={{ animationDelay: "0.5s" }}
        >
          AIRAVOTO GAMING
        </h1>

        <div className="w-64 md:w-96 mt-8">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm text-center mt-2">
            Loading... {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}

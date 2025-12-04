import { cn } from "@/lib/utils";

interface AnimatedCoinProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
};

// Thickness in pixels for each size
const thicknessValues = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 16,
};

export const AnimatedCoin = ({ size = "lg", animated = true, className }: AnimatedCoinProps) => {
  const thickness = thicknessValues[size];

  // Create edge layers for 3D thickness effect
  const edgeLayers = [];
  for (let i = 1; i <= thickness; i++) {
    edgeLayers.push(
      <div
        key={i}
        className="absolute inset-0 rounded-full"
        style={{
          transform: `translateZ(${-i}px)`,
          background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #CD853F 100%)',
          boxShadow: i === thickness ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative inline-block",
        sizeClasses[size],
        animated && "animate-coin-float",
        className
      )}
      style={{ perspective: "1000px" }}
    >
      {/* Glow effect */}
      {animated && (
        <div className="absolute inset-0 bg-gold/30 rounded-full blur-xl animate-pulse" />
      )}

      {/* 3D Coin Container */}
      <div
        className={cn(
          "relative w-full h-full",
          animated && "animate-coin-spin-3d"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: !animated ? "rotateY(0deg)" : undefined,
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(1px)",
          }}
        >
          <img
            src="/assets/alocoin.png"
            alt="AloCoin"
            className={cn(
              "w-full h-full object-contain drop-shadow-lg",
              !animated && "opacity-50 grayscale"
            )}
          />
        </div>

        {/* Edge layers for thickness */}
        {animated && edgeLayers}

        {/* Back face - same image, not mirrored */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: `rotateY(180deg) translateZ(${thickness + 1}px)`,
          }}
        >
          <img
            src="/assets/alocoin.png"
            alt="AloCoin"
            className={cn(
              "w-full h-full object-contain drop-shadow-lg",
              !animated && "opacity-50 grayscale"
            )}
          />
        </div>
      </div>

      {/* Shine effect */}
      {animated && (
        <div className="absolute inset-0 z-20 overflow-hidden rounded-full pointer-events-none">
          <div className="absolute -inset-full animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </div>
      )}
    </div>
  );
};

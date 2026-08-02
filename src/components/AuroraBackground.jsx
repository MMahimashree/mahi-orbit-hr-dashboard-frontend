import "./AuroraBackground.css";

const STARS = Array.from({ length: 90 }).map((_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() < 0.85 ? 1 : 2,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 3,
}));

export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob blob-violet" />
      <div className="aurora-blob blob-teal" />
      <div className="aurora-blob blob-gold" />
      <div className="starfield">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
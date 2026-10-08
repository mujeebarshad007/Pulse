import { useId } from "react";

/** Decorative illustration: never live health measurements. */
export function HeartVisual() {
  const gradient = useId();
  return (
    <div className="pn-heart-scene" aria-hidden="true">
      <span className="pn-heart-halo pn-heart-halo-one" />
      <span className="pn-heart-halo pn-heart-halo-two" />
      <svg className="pn-heart-sculpture" viewBox="0 0 220 220" fill="none">
        <defs>
          <linearGradient id={gradient} x1="45" y1="35" x2="174" y2="192" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d5fff0" /><stop offset=".43" stopColor="#48a58a" /><stop offset="1" stopColor="#115d51" />
          </linearGradient>
        </defs>
        <path className="pn-heart-body" d="M110 190C94 180 27 132 27 83c0-50 58-65 83-23 25-42 83-27 83 23 0 49-67 97-83 107Z" fill={`url(#${gradient})`} stroke="#e0fff1" strokeWidth="1.5" />
        <path d="M42 87c-3-30 28-48 46-24" stroke="#edfff4" strokeWidth="6" strokeLinecap="round" opacity=".55" />
        <path className="pn-heart-trace-base" d="M48 116h29l10-17 14 42 18-62 13 37h40" stroke="#ffffff40" strokeWidth="3" strokeLinejoin="round" />
        <path className="pn-heart-trace" pathLength="100" d="M48 116h29l10-17 14 42 18-62 13 37h40" stroke="#f0fff6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="pn-heart-star pn-heart-star-one">+</span>
      <span className="pn-heart-star pn-heart-star-two">+</span>
    </div>
  );
}

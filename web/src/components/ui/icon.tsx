import type { CSSProperties } from "react";

const paths = {
  user: "M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2 M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  upload: "M12 16V3 M7 8l5-5 5 5 M4 15v6h16v-6",
  download: "M12 3v13 M7 11l5 5 5-5 M4 17v4h16v-4",
  logout: "M9 3H3v18h6 M10 12h11 M16 7l5 5-5 5",
  plus: "M12 5v14 M5 12h14",
  info: "M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  edit: "M16 3l5 5-12 12-6 1 1-6z M13 6l5 5",

  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  calendar: "M4 5h16v16H4z M8 2v6 M16 2v6 M4 11h16 M8 15h2 M14 15h2",
  file: "M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6",
  book: "M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1z M12 5v16",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  chevron: "M9 5l7 7-7 7",
  down: "M6 9l6 6 6-6",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  heart: "M20 4c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 0 9 8 16 8-7 12-12 8-16z",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  shield: "M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6z M8 12l3 3 5-6",
  close: "M6 6l12 12 M6 18 18 6",
  check: "M5 12l4 4L19 6",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  sparkle: "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z",
  sliders: "M4 7h5 M15 7h5 M4 17h11 M21 17h-1 M9 4v6 M15 14v6",
} as const;

export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/**
 * Silhouettes culinaires au trait (encre fine) : présence mémorable sans photo ni surcharge.
 */
export function PtgLandingDecor({ variant = "full" }: { variant?: "full" | "subtle" }) {
  const rootClass =
    variant === "subtle" ? "ptg-landing-decor ptg-landing-decor--subtle" : "ptg-landing-decor";
  return (
    <div className={rootClass} aria-hidden>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--1"
        viewBox="0 0 100 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M22 40c11-9 27-11 39-3s21 18 21 30"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M20 52c2-6 8-10 16-10h32c7 0 13 4 15 10"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M24 58h54"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeDasharray="3 5"
          opacity="0.65"
        />
        <path d="M26 66h48" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M26 74c11 12 27 12 38 0"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M34 46c4-4 10-6 16-6s12 2 16 6"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--2"
        viewBox="0 0 90 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M28 20h34" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
        <path
          d="M31 20l5 38a9 9 0 0 0 9 8h0a9 9 0 0 0 9-8l5-38"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M45 20v-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <path
          d="M32 78c9 9 20 14 32 14"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <ellipse cx="46" cy="88" rx="14" ry="3.5" stroke="currentColor" strokeWidth="0.95" opacity="0.5" />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--3"
        viewBox="0 0 136 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M18 58c16-24 42-36 68-32 24 3 44 20 48 44"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M26 62c14-18 36-26 58-28 22-2 42 12 46 32"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.62"
        />
        <path
          d="M48 34c3-8 10-14 18-16"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--4"
        viewBox="0 0 84 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M14 58h56" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
        <path
          d="M20 58c0-16 11-28 25-28s25 12 25 28"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M38 24c2-6 7-11 14-13"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M52 20c3-4 8-7 13-8"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--5"
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <ellipse cx="56" cy="48" rx="28" ry="26" stroke="currentColor" strokeWidth="1.1" />
        <ellipse cx="56" cy="48" rx="14" ry="13" stroke="currentColor" strokeWidth="0.95" opacity="0.55" />
        <path d="M16 24v48" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
        <path d="M96 24v48" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--6"
        viewBox="0 0 98 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M20 56c0-18 15-32 32-32 14 0 26 9 30 22 7 2 12 9 12 17 0 10-8 17-19 17H32c-8 0-14-6-14-14 0-5 2-9 6-11"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
        <path d="M36 44c2 2 2 6 0 9" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
        <path d="M50 40c2 2 2 7 0 10" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
        <path d="M64 44c2 2 2 6 0 9" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--7"
        viewBox="0 0 64 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M20 58c3-14 1-28 5-40"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M32 60c-2-16 4-30 2-44"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M44 56c4-12 2-26 7-38"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinecap="round"
          opacity="0.68"
        />
      </svg>
      <svg
        className="ptg-landing-decor__float ptg-landing-decor__float--8"
        viewBox="0 0 112 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M14 24c4-8 20-12 42-12s38 4 42 12v4c-3 6-22 10-42 10S17 34 14 28v-4z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M24 20l5 6M38 18l4 7M54 17l5 8M70 19l4 6M86 21l5 5"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

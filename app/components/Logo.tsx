// Yunus İlgün logosu (Y + İ monogramı). Satır içi SVG: ek bir ağ isteği gerektirmez.
export default function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label="Yunus İlgün logosu"
      className={className}
    >
      <rect width="512" height="512" rx="96" fill="#020617" />
      <g fill="none" strokeLinecap="round" strokeWidth="46">
        <path d="M124 135 L206 262 L288 135" stroke="#2dd4bf" strokeLinejoin="round" />
        <path d="M206 262 L206 384" stroke="#2dd4bf" />
        <path d="M388 210 L388 384" stroke="#f1f5f9" />
      </g>
      <circle cx="388" cy="138" r="27" fill="#2dd4bf" />
    </svg>
  );
}

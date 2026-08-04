// components/MitraLogo.jsx
// Shared house mark used across Header, Footer, login/register pages,
// and both dashboards. Pass size and optional className for styling.

function MitraLogo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="10" r="7" fill="#EF9F27" />
      <polygon points="2,16 16,3 30,16" fill="#3B6D11" />
      <rect x="22" y="5" width="4" height="8" rx="1" fill="#3B6D11" />
      <rect x="9" y="15" width="14" height="12" rx="2" fill="#639922" />
      <rect x="13" y="20" width="6" height="8" rx="1" fill="#3B6D11" />
      <rect x="10" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
      <rect x="19" y="17" width="3" height="3" rx="0.5" fill="#C0DD97" />
      <rect x="9" y="26" width="14" height="3" rx="1" fill="#27500A" />
      <ellipse cx="16" cy="30" rx="4" ry="1.5" fill="#97C459" />
    </svg>
  );
}

export default MitraLogo;

export default function HeroIllustration() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <filter id="shadow1" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="8" floodColor="#6B6258" floodOpacity="0.15" />
          </filter>
          <filter id="shadow2" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6B6258" floodOpacity="0.08" />
          </filter>
          <filter id="deskShadow">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* Desk surface */}
        <path
          d="M40 370 L560 370 L500 440 L100 440 Z"
          fill="#D4C5B0"
        />

        {/* Desk shadow on floor */}
        <ellipse cx="300" cy="445" rx="200" ry="14" fill="#D4C5B0" opacity="0.5" filter="url(#deskShadow)" />

        {/* Paper underlay 1 (bottom) */}
        <g transform="rotate(-4, 300, 280)">
          <rect x="175" y="220" width="270" height="195" rx="6" fill="#EBE6DE" filter="url(#shadow1)" />
        </g>

        {/* Paper underlay 2 (middle) */}
        <g transform="rotate(-2, 300, 280)">
          <rect x="165" y="210" width="270" height="195" rx="6" fill="#F0ECE4" filter="url(#shadow2)" />
        </g>

        {/* Main paper */}
        <g transform="rotate(-0.5, 300, 270)">
          <rect x="155" y="200" width="270" height="195" rx="6" fill="white" filter="url(#shadow1)" />

          {/* Logo mark on paper */}
          <rect x="180" y="222" width="20" height="20" rx="4" fill="#0D6B56" />
          <path d="M186 236l3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="207" y="236" fontFamily="Geist, sans-serif" fontSize="11" fontWeight="700" fill="#1C1917">Rapicot</text>

          {/* Divider */}
          <line x1="180" y1="250" x2="400" y2="250" stroke="#EBE6DE" strokeWidth="1" />

          {/* Cliente line */}
          <text x="180" y="269" fontFamily="Geist, sans-serif" fontSize="10" fill="#6B6258">Señores</text>
          <rect x="180" y="274" width="120" height="6" rx="3" fill="#F5F2ED" />

          {/* Items */}
          <rect x="180" y="293" width="160" height="5" rx="2.5" fill="#F5F2ED" />
          <rect x="380" y="293" width="35" height="5" rx="2.5" fill="#F5F2ED" />
          <rect x="180" y="305" width="140" height="5" rx="2.5" fill="#F5F2ED" />
          <rect x="380" y="305" width="45" height="5" rx="2.5" fill="#F5F2ED" />
          <rect x="180" y="317" width="175" height="5" rx="2.5" fill="#F5F2ED" />
          <rect x="380" y="317" width="25" height="5" rx="2.5" fill="#F5F2ED" />

          {/* Dots separators */}
          <circle cx="174" cy="295" r="2" fill="#D1F0EA" />
          <circle cx="174" cy="307" r="2" fill="#D1F0EA" />
          <circle cx="174" cy="319" r="2" fill="#D1F0EA" />

          {/* Total */}
          <rect x="300" y="338" width="100" height="22" rx="4" fill="#D1F0EA" />
          <text x="310" y="353" fontFamily="Geist, sans-serif" fontSize="10" fill="#0D6B56" fontWeight="600">Total</text>
          <rect x="348" y="345" width="40" height="8" rx="4" fill="#0D6B56" opacity="0.3" />

          {/* Signature flourish watermark */}
          <g opacity="0.06">
            <path
              d="M350 370c8-14 16-28 28-28 8 0 8 8 4 14s-12 8-16 4-4-10 2-16"
              stroke="#0D6B56"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M378 352l-14 18-6-6"
              stroke="#0D6B56"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Paper clip detail */}
          <g transform="translate(410, 210)">
            <rect x="0" y="0" width="6" height="28" rx="3" fill="#B0A89A" stroke="#9C9284" strokeWidth="0.5" />
            <rect x="0" y="-2" width="6" height="8" rx="2" fill="#C4BBA8" stroke="#9C9284" strokeWidth="0.5" />
          </g>
        </g>

        {/* Signature mark accent */}
        <g transform="translate(145, 230)">
          <circle cx="0" cy="0" r="18" fill="white" stroke="#0D6B56" strokeWidth="1.5" />
          <path
            d="M-8 4l4 5 8-10"
            stroke="#0D6B56"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 -6c-2 2-4 3-6 2"
            stroke="#0D6B56"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

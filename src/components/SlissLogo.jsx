const SlissLogo = ({size=28}) => {
  const h = size;
  const w = size * 3.4;
  return (
    <svg width={w} height={h} viewBox="0 0 170 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sliss-inner" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0FBE7A" floodOpacity="0.4"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="166" height="46" rx="14" ry="14"
        fill="none" stroke="#22C55E" strokeWidth="4"/>
      <text
        x="85" y="36"
        textAnchor="middle"
        fontFamily="'DM Sans',sans-serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="-1"
        fill="#111318"
      >Sliss</text>
    </svg>
  );
};

export default SlissLogo;

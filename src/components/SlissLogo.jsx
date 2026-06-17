const SlissSymbol = ({size = 28, color = "#16A34A", color2 = "#22C55E"}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 8c-3.3 0-6.2 1.7-8 4.2C20.2 9.7 17.3 8 14 8 8.5 8 4 12.5 4 18s4.5 10 10 10c1.2 0 2.3-.2 3.3-.5L28 38c1.5 1.8 4.2 2 5.8.3 1.5-1.5 1.5-4 0-5.5l-6-7.2c3.8-1.8 6.2-5.6 6.2-9.6 0-4.4-2.5-8-6-8z" fill={color} opacity="0.9"/>
    <path d="M18 40c3.3 0 6.2-1.7 8-4.2 1.8 2.5 4.7 4.2 8 4.2 5.5 0 10-4.5 10-10s-4.5-10-10-10c-1.2 0-2.3.2-3.3.5L20 10c-1.5-1.8-4.2-2-5.8-.3-1.5 1.5-1.5 4 0 5.5l6 7.2C16.4 24.2 14 28 14 32c0 4.4 2.5 8 4 8z" fill={color2} opacity="0.9"/>
  </svg>
);

const SlissLogo = ({size = 28, dark = false}) => {
  const h = size;
  const symbolSize = h * 0.9;
  const textColor = dark ? "#F0F7F4" : "#111318";
  return (
    <div style={{display:"flex",alignItems:"center",gap: h * 0.25}}>
      <SlissSymbol size={symbolSize} color={dark ? "#4ADE80" : "#16A34A"} color2={dark ? "#22C55E" : "#22C55E"}/>
      <svg width={h * 2.6} height={h} viewBox="0 0 130 50" xmlns="http://www.w3.org/2000/svg">
        <text
          x="0" y="38"
          fontFamily="'DM Sans',sans-serif"
          fontWeight="800"
          fontSize="42"
          letterSpacing="-1"
          fill={textColor}
        >Sliss</text>
      </svg>
    </div>
  );
};

export { SlissSymbol };
export default SlissLogo;

function Chance(props) {
  const differentChance = {
    high: ["M13 7A6 6 0 1 0 1 7", "#37C99E"],
    middle: ["M9.052 1.362A6 6 0 0 0 1.004 6.79", "#FFA735"],
    low: ["M3.143 2.404a6 6 0 0 0-1.965 3.144", "#FF6B77"],
  };

  return (
    <svg
      width={14}
      height={8}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 7a6 6 0 1 1 12 0" stroke="#EEF0F3" strokeWidth={2} />
      <path
        d={differentChance[props.state][0]}
        stroke={differentChance[props.state][1]}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Chance;

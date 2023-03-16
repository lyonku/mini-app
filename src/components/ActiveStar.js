function ActiveStar(props) {
  const screenWidth = window.screen.width;
  const fillColorArray = [
    "#FF6B77",
    "#FF6B77",
    "#FFA735",
    "#37C99E",
    "#37C99E",
  ];
  return (
    <svg
      width={32}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m13.5.5 4.364 7.493 8.475 1.835-5.777 6.466.873 8.628-7.935-3.497-7.935 3.497.873-8.628L.661 9.828l8.475-1.835L13.5.5Z"
        fill={
          screenWidth < 1200
            ? fillColorArray[props.rating - 1]
            : fillColorArray[props.hover - 1] ||
              fillColorArray[props.rating - 1]
        }
      />
    </svg>
  );
}
export default ActiveStar;

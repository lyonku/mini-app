function ActiveStarSmall(props) {
  const fillColorArray = [
    "#FF6B77",
    "#FF6B77",
    "#FFA735",
    "#37C99E",
    "#37C99E",
  ];
  if (isNaN(props.color)) {
    return false;
  }
  return (
    <svg
      width={14}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m8 2 1.94 3.33 3.766.816L11.14 9.02l.388 3.834L8 11.3l-3.527 1.554.389-3.834-2.568-2.874L6.06 5.33 8 2Z"
        fill={props.color ? fillColorArray[props?.color - 1] : 0}
        id={props?.id}
      />
    </svg>
  );
}
export default ActiveStarSmall;

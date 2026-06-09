export default function PriceChangeIndicator({
  sign,
  className = "w-5 h-5",
}) {
  const hasTextColor = /text-[^\s]+/.test(className);

  const defaultColor =
    sign === 0 ? "#A1A1AA" : sign > 0 ? "#b7ff64" : "#ff2c2c";

  const strokeColor = hasTextColor ? "currentColor" : defaultColor;

  return (
    <>
      {sign === 0 ? (
        <div className={className}>
          <svg className="w-full h-full block" viewBox="0 0 12 9" fill="none">
            <path
              d="M10.7167 7.72686L5.73333 7.7749L0.75 7.72686M10.7167 0.750188L5.73333 0.798235L0.75 0.750189"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : sign > 0 ? (
        <div className={className}>
          <svg className="w-full h-full block" viewBox="0 0 12 14" fill="none">
            <path
              d="M10.7167 12.71L5.73333 7.72663L0.75 12.71M10.7167 5.73329L5.73333 0.74996L0.75 5.73329"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div className={className}>
          <svg className="w-full h-full block" viewBox="0 0 12 14" fill="none">
            <path
              d="M0.750131 0.75L5.73346 5.73333L10.7168 0.75M0.75013 7.72667L5.73346 12.71L10.7168 7.72667"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
  );
}
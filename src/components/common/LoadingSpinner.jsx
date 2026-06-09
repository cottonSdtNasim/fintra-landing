export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        className="animate-spin size-16 text-light_green_gunMetal_color"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="opacity-25"
          d="M98 50C98 76.5097 76.5097 98 50 98C23.4903 98 2 76.5097 2 50C2 23.4903 23.4903 2 50 2C76.5097 2 98 23.4903 98 50ZM6.69319 50C6.69319 73.9177 26.0823 93.3068 50 93.3068C73.9177 93.3068 93.3068 73.9177 93.3068 50C93.3068 26.0823 73.9177 6.69319 50 6.69319C26.0823 6.69319 6.69319 26.0823 6.69319 50Z"
          fill="currentColor"
        />
        <path
          d="M95.6546 50C96.9499 50 98.006 48.9493 97.9427 47.6555C97.6736 42.153 96.4589 36.7317 94.3462 31.6312C91.934 25.8076 88.3983 20.5161 83.9411 16.0589C79.4839 11.6017 74.1924 8.06601 68.3688 5.65378C63.2683 3.54108 57.847 2.32637 52.3445 2.05729C51.0507 1.99402 50 3.05009 50 4.34543C50 5.64077 51.0509 6.68423 52.3443 6.75435C57.2305 7.01922 62.0424 8.11064 66.5737 9.98757C71.8282 12.1641 76.6026 15.3542 80.6242 19.3758C84.6458 23.3974 87.8359 28.1718 90.0124 33.4263C91.8894 37.9576 92.9808 42.7695 93.2457 47.6557C93.3158 48.9491 94.3592 50 95.6546 50Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

{
  /* <svg
  className="animate-spin size-16 text-light_green_gunMetal_color"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  ></circle>
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  ></path>
</svg> */
}

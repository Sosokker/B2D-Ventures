export default function Loading() {
  return (
    <div className="container flex items-center justify-center h-screen">
      <div className="text-center">
        <svg
          className="animate-spin h-12 w-12 text-gray-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-2.832 2.832A10.003 10.003 0 0112 22v-4a8.001 8.001 0 01-6-5.709z"
          ></path>
        </svg>
        <p className="text-lg font-semibold text-gray-600">Loading data...</p>
      </div>
    </div>
  );
}

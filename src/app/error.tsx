"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container max-w-screen-xl flex justify-center items-center flex-col gap-8 p-8 bg-white rounded-lg shadow-lg border-2 border-red-500">
        <div className="flex items-center justify-center gap-4 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 10-18 0 9 9 0 0018 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold">Something went wrong!</h1>
        </div>

        <p className="text-lg text-center text-gray-800">{error.message}</p>

        <button
          className="inline-block bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}

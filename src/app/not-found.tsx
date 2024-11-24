import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">This page could not be found :(</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent-500 text-primary-800 px-8 py-4 text-lg font-medium rounded transition duration-200 hover:bg-accent-600 dark:bg-accent-400 dark:text-primary-800 dark:hover:bg-accent-500"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}

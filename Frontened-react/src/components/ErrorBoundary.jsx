import { useRouteError } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();

  console.log("Route Error:", error);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">
        Something went wrong 
      </h1>

      <p className="mt-2 text-gray-600">
        {error?.status} - {error?.statusText}
      </p>

      <p className="mt-2 text-red-400">
        {error?.message || "Unexpected error"}
      </p>
    </div>
  );
}

export default ErrorBoundary;
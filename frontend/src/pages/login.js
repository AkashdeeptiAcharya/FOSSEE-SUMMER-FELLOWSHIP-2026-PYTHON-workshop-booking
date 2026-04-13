export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
            FOSSEE
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Login to manage your workshops
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />

          <div className="text-right text-sm text-blue-500 cursor-pointer hover:underline">
            Forgot Password?
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 hover:shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
  onClick={() => window.location.href = "/register"}
  className="text-blue-500 cursor-pointer hover:underline"
>Register</span>
        </p>
      </div>
    </div>
  );
}

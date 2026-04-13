export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
            FOSSEE
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Register to start managing workshops
        </p>

        <form className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 hover:shadow-md transition">
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
  onClick={() => window.location.href = "/"}
  className="text-blue-500 cursor-pointer hover:underline"
>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
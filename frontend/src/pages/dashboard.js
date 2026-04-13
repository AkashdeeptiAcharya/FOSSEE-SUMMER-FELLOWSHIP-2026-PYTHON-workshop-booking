export default function Dashboard() {
  const workshops = [
    {
      title: "Python Workshop",
      state: "Odisha",
      date: "2026-04-20",
      status: "Success",
    },
    {
      title: "AI Basics",
      state: "Delhi",
      date: "2026-04-22",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Manage and track all your workshops
          </p>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            + Propose Workshop
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="bg-white p-4 rounded-xl shadow md:col-span-1 h-fit sticky top-4">
            <h2 className="font-semibold mb-3">Filters</h2>

            <p className="text-sm text-gray-500 mb-1">From Date</p>
            <input type="date" className="w-full mb-3 p-2 border rounded" />

            <p className="text-sm text-gray-500 mb-1">To Date</p>
            <input type="date" className="w-full mb-3 p-2 border rounded" />

            <p className="text-sm text-gray-500 mb-1">State</p>
            <select className="w-full mb-3 p-2 border rounded">
              <option>Select State</option>
            </select>

            <p className="text-sm text-gray-500 mb-1">Workshop Type</p>
            <select className="w-full mb-3 p-2 border rounded">
              <option>Select Type</option>
            </select>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Apply Filters
            </button>
          </div>

          {/* Main */}
          <div className="md:col-span-3">
            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer">
                <p className="text-gray-500">Total Workshops</p>
                <h2 className="text-xl font-bold text-blue-600">24</h2>
              </div>

              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer">
                <p className="text-gray-500">Upcoming</p>
                <h2 className="text-xl font-bold text-yellow-500">8</h2>
              </div>

              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer">
                <p className="text-gray-500">Completed</p>
                <h2 className="text-xl font-bold text-green-600">16</h2>
              </div>
            </div>
            <div className="h-px bg-gray-200 my-4"></div>
            {/* Table */}
            <div className="bg-white p-4 rounded-xl shadow overflow-x-auto mt-4">
              <input
                type="text"
                placeholder=" Search workshops..."
                className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-sm text-gray-500 mb-2">
                Showing {workshops.length} workshop
                {workshops.length !== 1 && "s"}
              </p>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr className="border-b">
                    <th className="p-3">Title</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {workshops.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500"
                      >
                        No workshops found
                      </td>
                    </tr>
                  ) : (
                    workshops.map((w, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-2">{w.title}</td>
                        <td className="p-2">{w.state}</td>
                        <td className="p-2">{w.date}</td>

                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              w.status === "Success"
                                ? "bg-green-100 text-green-700"
                                : w.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

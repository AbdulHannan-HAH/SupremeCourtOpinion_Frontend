export default function Dashboard() {
  const role = localStorage.getItem("role");
  const username = ""; // you can store username in localStorage if you want

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2">Role: {role}</p>
    </div>
  );
}

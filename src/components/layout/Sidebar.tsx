export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4">Intranet</h2>

      <nav className="flex flex-col gap-3 text-gray-700">
        <a href="/dashboard">Dashboard</a>
        <a href="/planning">Planning</a>
        <a href="/documents">Documents</a>
        <a href="/notes">Notes</a>
        <a href="/messages">Messages</a>
        <a href="/admin">Admin</a>
      </nav>
    </aside>
  );
}

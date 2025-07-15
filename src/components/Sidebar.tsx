export function Sidebar() {
    return (
      <aside className="w-64 h-full bg-white border-r py-6 z-50">
        <div className="text-xl font-semibold text-blue-600 px-4 mb-2">
          Demo Organization
        </div>
        <div className="border-b border-gray-200 -ml-4" />
        <nav className="px-4 mt-2 space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="uppercase text-xs text-gray-400 mb-2">Main</h4>
            <ul className="space-y-2">
              <li><a href="/dash" className="hover:text-blue-600">Dashboard</a></li>
              <li><a href="/mentors" className="hover:text-blue-600">Mentors</a></li>
              <li><a href="/mentees" className="hover:text-blue-600">Mentees</a></li>
              <li><a href="/matches" className="hover:text-blue-600">Matches</a></li>
              <li><a href="/communications" className="hover:text-blue-600">Communications</a></li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-xs text-gray-400 mt-6 mb-2">Administration</h4>
            <ul className="space-y-2">
              <li><a href="/form-builder" className="hover:text-blue-600">Form Builder</a></li>
              <li><a href="/branding" className="hover:text-blue-600">Branding</a></li>
              <li><a href="/settings" className="hover:text-blue-600">Settings</a></li>
              <li><a href="/admin" className="hover:text-blue-600">Admin Profile</a></li>
            </ul>
          </div>
        </nav>
      </aside>
    );
  }
  
export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">Girah Nirman</div>
        <div>
          <button className="px-4 py-2 bg-primary rounded-lg mr-2">Login</button>
          <button className="px-4 py-2 border border-primary text-primary rounded-lg">Register</button>
        </div>
      </div>
    </nav>
  );
}

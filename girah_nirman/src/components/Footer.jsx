export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Girah Nirman HQ</h3>
          <p>123 Main Road, City Name</p>
          <p>State, Country - ZIP</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>Phone: +91 9876543210</p>
          <p>Email: info@girahnirman.com</p>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            width="100%"
            height="150"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}

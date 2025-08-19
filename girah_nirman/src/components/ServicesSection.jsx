import { Hammer, Home, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

function ServicesSection() {
  const services = [
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Turnkey Construction",
      desc: "From foundation to finish — we handle every step of your home build.",
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: "Project Management",
      desc: "Transparent milestones, regular updates, and budget control.",
    },
    {
      icon: <Hammer className="h-8 w-8 text-primary" />,
      title: "Material Procurement",
      desc: "Verified vendors, bulk pricing, and top-quality materials.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4"
        >
          Our Core Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          Whether you’re in the city or working abroad, we ensure your dream
          home is built to perfection without you worrying about the details.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="bg-white shadow-md rounded-xl p-6 text-left hover:shadow-lg transition"
            >
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;

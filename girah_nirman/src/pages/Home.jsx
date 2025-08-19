// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import {
  FaHardHat,
  FaClock,
  FaRupeeSign,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const navigate = useNavigate(); 
  const [contactForm, setContactForm] = React.useState({
  name: "",
  phoneOrEmail: "",
  message: ""
});
const [statusMsg, setStatusMsg] = React.useState(null);

const submitContactForm = async () => {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm)
    });
    const data = await res.json();
    if (data.success) {
      setStatusMsg("✅ Thank you! We will contact you soon.");
      setContactForm({ name: "", phoneOrEmail: "", message: "" });
    } else {
      setStatusMsg("❌ " + (data.message || "Something went wrong."));
    }
  } catch (err) {
    setStatusMsg("❌ Server error. Please try again later.");
  }
};




  const projects = [
    {
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      title: "Skyline Villa",
      desc: "Luxury hillside residence with seamless indoor–outdoor living.",
    },
    {
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      title: "Aurora Residences",
      desc: "Modern facade, energy-efficient design, premium finishes.",
    },
    {
      img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1600&q=80",
      title: "Ocean Crest",
      desc: "Contemporary beachside home with panoramic glazing.",
    },
  ];

  const testimonials = [
    {
      quote:
        "They handled everything end-to-end. Transparent pricing and delivered before deadline.",
      name: "Rahul Verma",
      role: "Software Engineer, Bengaluru",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=256&q=60",
    },
    {
      quote:
        "Premium quality, zero stress. We got daily progress updates and site photos.",
      name: "Aditi Sharma",
      role: "Product Manager, Pune",
      avatar:
        "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=256&q=60",
    },
    {
      quote:
        "Materials, labor, approvals — all streamlined. Truly professional.",
      name: "Sanjay Kumar",
      role: "Entrepreneur, Patna",
      avatar:
        "https://images.unsplash.com/photo-1531123414780-f74241e9e8f1?auto=format&fit=crop&w=256&q=60",
    },
  ];

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3800,
    pauseOnHover: true,
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mt-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg">
            <nav className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow"></div>
                <span className="text-xl md:text-2xl font-extrabold tracking-wide">
                  GIRAH NIRMAN
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a className="hover:text-amber-600 transition" href="#projects">
                  Projects
                </a>
                <a className="hover:text-amber-600 transition" href="#services">
                  Services
                </a>
                <a className="hover:text-amber-600 transition" href="#why">
                  Why Us
                </a>
                <a className="hover:text-amber-600 transition" href="#contact">
                  Contact
                </a>
                {/* New Admin Link */}
               <a onClick={() => {const token = localStorage.getItem("adminToken");
               if (token) {
                navigate("/admin"); 
              } else {
                navigate("/admin-auth"); 
              }
            }}
            className="hover:text-amber-600 transition cursor-pointer">
               Admin
               </a>

              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl border border-slate-300 hover:border-amber-500 hover:text-amber-600 transition">
                  Login
                </button>
                <button className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition shadow">
                  Register
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO (Video) */}
      <section className="relative h-[92vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://videos.pexels.com/video-files/854521/854521-hd_1920_1080_30fps.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-[rgba(7,10,20,0.55)]" />
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight">
                We Build Homes.
                <span className="block text-amber-400">You Build Futures.</span>
              </h1>
              <p className="mt-5 text-slate-200 text-lg md:text-xl">
                End-to-end home construction for busy professionals — from land
                to handover with transparent pricing and on-time delivery.
              </p>
              <div className="mt-8 flex gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition shadow"
                >
                  Get a Quote
                </a>
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-xl border border-white/60 text-white hover:bg-white hover:text-slate-900 transition"
                >
                  View Projects
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
            {["Partner One", "Partner Two", "Partner Three", "Partner Four", "Partner Five"].map(
              (name, i) => (
                <div
                  key={i}
                  className="h-10 w-36 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* PROJECTS CAROUSEL */}
      <section id="projects" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-10"
          >
            Recent Projects
          </motion.h2>
          <Slider {...sliderSettings}>
            {projects.map((p, idx) => (
              <div key={idx} className="px-1 md:px-3">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    src={p.img}
                    alt={p.title}
                    className="h-[420px] w-full object-cover rounded-2xl shadow-xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="px-1"
                  >
                    <h3 className="text-2xl md:text-3xl font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-slate-600">{p.desc}</p>
                    <div className="mt-6">
                      <a
                        href="#contact"
                        className="inline-block px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                      >
                        Start Similar Project
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Our Services
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FaHardHat className="text-3xl text-amber-500" />,
                title: "Design & Build",
                desc: "Architectural design, structural planning, and turnkey execution.",
              },
              {
                icon: <FaClock className="text-3xl text-amber-500" />,
                title: "On-Time Delivery",
                desc: "Milestone-based schedules and weekly progress reporting.",
              },
              {
                icon: <FaRupeeSign className="text-3xl text-amber-500" />,
                title: "Transparent Pricing",
                desc: "Bill of quantities, vendor quotes, and zero hidden charges.",
              },
              {
                icon: <FaShieldAlt className="text-3xl text-amber-500" />,
                title: "Quality Assurance",
                desc: "Brand materials, site audits, and multi-point checks.",
              },
              {
                icon: <FaHardHat className="text-3xl text-amber-500" />,
                title: "Approvals & Compliance",
                desc: "Government approvals and safety compliance handled.",
              },
              {
                icon: <FaShieldAlt className="text-3xl text-amber-500" />,
                title: "Post-Handover Support",
                desc: "Maintenance and warranty support after delivery.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-slate-600">{item.desc}</p>
                  </div>
                </div>
                <div className="mt-4 h-1 w-0 bg-amber-500 group-hover:w-full transition-all rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US / COUNTERS */}
      <section id="why" className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-10"
          >
            Why Choose Girah Nirman
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: "Projects Delivered", value: 450 },
              { label: "Cities Covered", value: 18 },
              { label: "Client Satisfaction", value: 98 },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="rounded-2xl bg-slate-800/60 border border-white/10 p-8 text-center"
              >
                <p className="text-5xl font-extrabold text-amber-400">
                  {c.value}
                  <span className="text-3xl align-top">{i === 2 ? "%" : "+"}</span>
                </p>
                <p className="mt-2 text-slate-300">{c.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-700 italic">“{t.quote}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + MAP */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-10"
          >
            Contact Us
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow">
              <div className="flex items-center gap-3 text-lg">
                <FaPhoneAlt className="text-amber-500" />
                <a href="tel:9466940577" className="hover:text-amber-600">
                  +91 9466940577
                </a>
              </div>
              <div className="mt-4 flex items-center gap-3 text-lg">
                <FaEnvelope className="text-amber-500" />
                <a
                  href="mailto:contact@girahnirman.com"
                  className="hover:text-amber-600"
                >
                  contact@girahnirman.com
                </a>
              </div>
              <div className="mt-4 flex items-start gap-3 text-lg">
                <FaMapMarkerAlt className="mt-1 text-amber-500" />
                <p>Devi Mandir, Attoua, Nawada, Bihar 805110</p>
              </div>

              <form className="mt-8 grid grid-cols-1 gap-4">
                <input
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your Name"
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                />

                <input
                  value={contactForm.phoneOrEmail}
                  onChange={e => setContactForm({ ...contactForm, phoneOrEmail: e.target.value })}
                  placeholder="Phone or Email"
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                />

                <textarea
                  rows="4"
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your project"
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                />

                <button
                  type="button"
                  onClick={submitContactForm}
                  className="mt-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400 transition"
                >
                  Request Callback
                </button>

                {statusMsg && (
                  <p className="text-sm mt-2">{statusMsg}</p>
                )}
              </form>

            </div>

            <div className="rounded-2xl overflow-hidden shadow border border-slate-200">
              <iframe
                title="Giraj Nirman HQ Map"
                src="https://www.google.com/maps?q=Devi%20Mandir,%20Attoua,%20Nawada,%20Bihar%20805110&output=embed"
                width="100%"
                height="100%"
                className="min-h-[420px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
              <span className="font-extrabold tracking-wide text-white">
                GIRAH NIRMAN
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Engineering excellence, transparent delivery, and premium quality
              across India.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#projects" className="hover:text-amber-500">Projects</a></li>
              <li><a href="#services" className="hover:text-amber-500">Services</a></li>
              <li><a href="#why" className="hover:text-amber-500">Why Us</a></li>
              <li><a href="#contact" className="hover:text-amber-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>How it Works</li>
              <li onClick={() => navigate("/calculator")} className="hover:text-amber-500 cursor-pointer"> Cost Calculator</li>
              <li>Materials & Brands</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Reach Us</h4>
            <p className="text-sm">Devi Mandir, Attoua, Nawada, Bihar 805110</p>
            <p className="text-sm mt-2">Phone: +91 9466940577</p>
            <p className="text-sm">Email: contact@girahnirman.com</p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} Girah Nirman. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

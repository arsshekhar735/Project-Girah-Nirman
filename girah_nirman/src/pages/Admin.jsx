import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../utils/api";
import { getAuthToken } from "../utils/auth";


import {
  Building2,
  LogOut,
  FileText,
  Phone,
  LayoutGrid,
  BarChart3,
  Settings,
  Search,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

/**
 * GIRAH NIRMAN — ENTERPRISE ADMIN DASHBOARD (Full Redesign)
 * ---------------------------------------------------------
 * - Preserves your existing data fetching + update logic
 * - Adds sidebar layout, premium header, stats cards
 * - Adds analytics (bar + pie charts) from existing data
 * - Dark mode toggle (persists)
 * - Modern table styling; search + pagination kept
 */

export default function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState({ quotes: [], contacts: [] });
  const [loading, setLoading] = useState(true);
  const [quoteSearch, setQuoteSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [quotePage, setQuotePage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const pageSize = 7;
  const [expandedQuotes, setExpandedQuotes] = useState(new Set());
  const [expandedContacts, setExpandedContacts] = useState(new Set());
  const token = getAuthToken();
const [activePage, setActivePage] = useState("dashboard");
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("girah-theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("girah-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("girah-theme", "light");
    }
  }, [dark]);

  // Load data on mount (unchanged)
  useEffect(() => {
    async function loadData() {
      const result = await apiGet("/admin/data");
      if (result) setData(result);
      setLoading(false);
    }
    loadData();
  }, []);

  // Toggle expanded rows
  const toggleQuoteExpand = (id) => {
    const s = new Set(expandedQuotes);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedQuotes(s);
  };
  const toggleContactExpand = (id) => {
    const s = new Set(expandedContacts);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedContacts(s);
  };

  // Filters (unchanged)
  const filteredQuotes = data.quotes.filter((q) =>
    [q.name, q.email, q.phone, q.notes]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(quoteSearch.toLowerCase()))
  );
  const filteredContacts = data.contacts.filter((c) =>
    [c.name, c.phoneOrEmail, c.message]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(contactSearch.toLowerCase()))
  );

  // Pagination (unchanged)
  const pagedQuotes = filteredQuotes.slice((quotePage - 1) * pageSize, quotePage * pageSize);
  const pagedContacts = filteredContacts.slice((contactPage - 1) * pageSize, contactPage * pageSize);

  // Update APIs (unchanged)
  const updateQuoteStatusOrFeedback = async (id, updatedFields) => {
    await apiPut(`/admin/quote/${id}/status`, updatedFields);
    const result = await apiGet("/admin/data");
    if (result) setData(result);
  };
  const updateContactStatusOrFeedback = async (id, updatedFields) => {
    await apiPut(`/admin/contact/${id}/status`, updatedFields);
    const result = await apiGet("/admin/data");
    if (result) setData(result);
  };

  // ----------------------------
  // Derived analytics
  // ----------------------------
  const quoteStatusCounts = useMemo(() => {
    const counts = { Pending: 0, "Case Closed": 0, "Not Attended": 0 };
    for (const q of data.quotes) counts[q.status] = (counts[q.status] || 0) + 1;
    return [
      { name: "Pending", value: counts["Pending"] || 0 },
      { name: "Case Closed", value: counts["Case Closed"] || 0 },
      { name: "Not Attended", value: counts["Not Attended"] || 0 },
    ];
  }, [data.quotes]);

  const contactStatusCounts = useMemo(() => {
    const counts = { Pending: 0, "Case Closed": 0, "Not Attended": 0 };
    for (const c of data.contacts) counts[c.status] = (counts[c.status] || 0) + 1;
    return [
      { name: "Pending", value: counts["Pending"] || 0 },
      { name: "Case Closed", value: counts["Case Closed"] || 0 },
      { name: "Not Attended", value: counts["Not Attended"] || 0 },
    ];
  }, [data.contacts]);

  const COLORS = ["#F59E0B", "#10B981", "#EF4444"]; // amber, emerald, rose

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
        Loading admin data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 font-[Poppins]">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 grid place-items-center shadow">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Girah Nirman</span>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
        </button>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* SIDEBAR */}
        <aside
          className={`fixed lg:static z-50 inset-y-0 left-0 w-72 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800`}
        >
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 grid place-items-center shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Girah Nirman</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Building Tomorrow, Today</p>
            </div>
            <button
              className="ml-auto lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-2">
            {[
              { icon: LayoutGrid, label: "Dashboard" },
              { icon: FileText, label: "Quotes" },
              { icon: Phone, label: "Contacts" },
              { icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-indigo-50 hover:text-indigo-800 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-200 transition"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto px-4 pb-6">
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin-auth");
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2.5 rounded-xl shadow hover:scale-[1.01] active:scale-[0.99] transition"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 p-6 lg:p-10">
          {/* Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-400">Secure view of quotes & contacts</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark((d) => !d)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-sm">{dark ? "Light" : "Dark"} Mode</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  navigate("/admin-auth");
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[{label: "Total Quotes", value: data.quotes.length, icon: FileText}, {label: "Total Contacts", value: data.contacts.length, icon: Phone}].map((c, idx) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/80 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{c.value}</p>
                  </div>
                  <c.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
              </motion.div>
            ))}
          </section>

          {/* Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Quotes by Status
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quoteStatusCounts}>
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis allowDecimals={false} stroke="#6B7280" />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Contacts by Status
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contactStatusCounts} dataKey="value" nameKey="name" outerRadius={92} label>
                      {contactStatusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* QUOTES */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-6 mb-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Quotes</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quotes..."
                  className="pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Notes</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Feedback</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedQuotes.map((q) => (
                    <React.Fragment key={q.id}>
                      <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="p-3">{q.name}</td>
                        <td>{q.email}</td>
                        <td>{q.phone}</td>
                        <td className="max-w-xs truncate" title={q.notes}>{q.notes}</td>
                        <td className="text-right font-semibold text-gray-700 dark:text-gray-200">₹{q.calcResult?.total}</td>
                        <td>
                          <select
                            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={q.status}
                            onChange={(e) => updateQuoteStatusOrFeedback(q.id, { status: e.target.value })}
                          >
                            <option value="Pending">🟡 Pending</option>
                            <option value="Case Closed">🟢 Case Closed</option>
                            <option value="Not Attended">🔴 Not Attended</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Feedback"
                            value={q.userFeedback || ""}
                            onChange={(e) => updateQuoteStatusOrFeedback(q.id, { userFeedback: e.target.value })}
                            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td>
                          <button onClick={() => toggleQuoteExpand(q.id)} className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                            {expandedQuotes.has(q.id) ? "Hide Details" : "Show Details"}
                          </button>
                        </td>
                      </tr>

                      {expandedQuotes.has(q.id) && (
                        <tr className="bg-gray-50 dark:bg-gray-800/60">
                          <td colSpan={8} className="p-4 text-sm space-y-1">
                            <p><strong>Material Cost:</strong> ₹{q.calcResult.materialCost.toLocaleString()}</p>
                            <p><strong>Labor Cost:</strong> ₹{q.calcResult.laborCost.toLocaleString()}</p>
                            <p><strong>Electrical Cost:</strong> ₹{q.calcResult.extras.electricalCost.toLocaleString()}</p>
                            <p><strong>Plumbing Cost:</strong> ₹{q.calcResult.extras.plumbingCost.toLocaleString()}</p>
                            <p><strong>False Ceiling Cost:</strong> ₹{q.calcResult.extras.falseCeilingCost.toLocaleString()}</p>
                            <p><strong>Supervision Cost:</strong> ₹{q.calcResult.supervisionCost.toLocaleString()}</p>
                            <p><strong>Transport:</strong> ₹{q.calcResult.transport.toLocaleString()}</p>
                            <p><strong>Contingency:</strong> ₹{q.calcResult.contingency.toLocaleString()}</p>
                            <p><strong>Tax (GST):</strong> ₹{q.calcResult.tax.toLocaleString()}</p>
                            <p><strong>Subtotal:</strong> ₹{q.calcResult.subtotal.toLocaleString()}</p>
                            <p><strong>Total:</strong> ₹{q.calcResult.total.toLocaleString()}</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={quotePage === 1}
                onClick={() => setQuotePage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={quotePage * pageSize >= filteredQuotes.length}
                onClick={() => setQuotePage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>

          {/* CONTACTS */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Contacts</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th>Phone / Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedContacts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <td className="p-3">{c.name}</td>
                      <td>{c.phoneOrEmail}</td>
                      <td className="max-w-xs truncate" title={c.message}>
                        {c.message?.length > 40 ? c.message.slice(0, 37) + "..." : c.message}
                      </td>
                      <td>
                        <select
                          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={c.status}
                          onChange={(e) => updateContactStatusOrFeedback(c.id, { status: e.target.value })}
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="Case Closed">🟢 Case Closed</option>
                          <option value="Not Attended">🔴 Not Attended</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Feedback"
                          value={c.userFeedback || ""}
                          onChange={(e) => updateContactStatusOrFeedback(c.id, { userFeedback: e.target.value })}
                          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={contactPage === 1}
                onClick={() => setContactPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={contactPage * pageSize >= filteredContacts.length}
                onClick={() => setContactPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

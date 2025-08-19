import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Autocomplete City Component using Geoapify with accessibility and motion ---
function CityAutoComplete({ value, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [active, setActive] = useState(-1);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!inputVal) {
      setOptions([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          inputVal
        )}&type=city&filter=countrycode:IN&limit=6&apiKey=38262ddcf10b456abdb83c1931c832ae`
      )
        .then((res) => res.json())
        .then((data) => {
          setOptions(
            (data.features || []).map(
              (f) => f.properties.city || f.properties.name || f.properties.formatted
            )
          );
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [inputVal]);

  useEffect(() => {
    function handle(e) {
      if (!ref.current?.contains(e.target)) setShow(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const select = useCallback(
    (val) => {
      setInputVal(val);
      onChange(val);
      setShow(false);
      setActive(-1);
    },
    [onChange]
  );

  return (
    <div className="relative" ref={ref}>
      <input
        className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition shadow-sm text-base"
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value);
          onChange(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        placeholder={placeholder || "Enter city/region"}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={show ? "true" : "false"}
        aria-controls="city-autocomplete-list"
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, options.length - 1));
          else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
          else if (e.key === "Enter" && options[active]) {
            e.preventDefault();
            select(options[active]);
          } else if (e.key === "Escape") {
            setShow(false);
            setActive(-1);
          }
        }}
      />
      <AnimatePresence>
        {show && (options.length > 0 || loading) && (
          <motion.ul
            id="city-autocomplete-list"
            className="absolute z-30 left-0 right-0 mt-1 bg-slate-700 text-white rounded-lg shadow-lg max-h-52 overflow-auto text-base ring-1 ring-black ring-opacity-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {loading && (
              <li className="px-4 py-2 text-slate-400 select-none">Searching…</li>
            )}
            {!loading &&
              options.map((c, i) => (
                <li
                  key={c}
                  tabIndex={-1}
                  className={`px-4 py-2 cursor-pointer truncate ${
                    active === i
                      ? "bg-amber-500 text-black"
                      : "hover:bg-amber-600"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(c);
                  }}
                  onMouseMove={() => setActive(i)}
                  aria-selected={active === i}
                  role="option"
                >
                  {c}
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Reusable components with dark mode support ---
function ResponsiveGrid({ children, minCol = 1, medCol = 2, lgCol = 3 }) {
  const classes = [
    "grid gap-4 sm:gap-6",
    minCol && "grid-cols-1",
    medCol && "sm:grid-cols-2",
    lgCol && "lg:grid-cols-3",
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
function Field({ label, htmlFor, description = "", children }) {
  return (
    <label htmlFor={htmlFor} className="block text-base font-medium pb-1 text-slate-200">
      <div className="flex items-center space-x-2">
        <span>{label}</span>
        {description && (
          <span className="text-xs italic text-slate-400">{description}</span>
        )}
      </div>
      {children}
    </label>
  );
}
function Input({ type = "text", className = "", ...rest }) {
  return (
    <input
      type={type}
      className={
        "w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition " +
        className
      }
      {...rest}
    />
  );
}
function Select({ children, ...rest }) {
  return (
    <select
      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition"
      {...rest}
    >
      {children}
    </select>
  );
}
function FormCard({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-2xl shadow-lg border border-slate-600 mb-6 p-0"
      layout
    >
      <div className="px-6 pt-6 pb-1">
        <h2 className="text-lg font-bold tracking-tight text-amber-400 mb-0">{title}</h2>
      </div>
      <div className="px-6 pb-6 pt-2">{children}</div>
    </motion.section>
  );
}

const FALLBACK_RATES = {
  materialPerSqft: { economy: 900, standard: 1500, premium: 2200 },
  laborPerSqft: 300,
  supervisionPercent: 6,
  electrical: { basic: 50, standard: 100, smart: 200 },
  plumbing: { standard: 60, premium: 120 },
  falseCeilingPerSqft: 60,
  transportPerKm: 1000,
  gstPercent: 18,
  contingencyPercent: 7,
};

export default function Calculator() {
  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [ratesError, setRatesError] = useState(null);
  const [form, setForm] = useState({
    constructionUse: "residential",
    constructionType: "new",
    area: "",
    unit: "sqft",
    floors: 1,
    floorHeight: 10,
    plotSize: "",
    materialQuality: "standard",
    wallMaterial: "brick",
    flooring: "tiles",
    roofType: "concrete",
    paintQuality: "standard",
    laborRate: "",
    skilledRatio: 60,
    supervisionPercent: "",
    electrical: "standard",
    plumbing: "standard",
    doorWindow: "aluminium",
    falseCeiling: false,
    falseCeilingArea: "",
    exteriorWork: { boundaryWall: false, landscaping: false, parking: false },
    city: "",
    transportCharges: "",
    contingencyPercent: "",
    gstPercent: "",
  });
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadStatus, setLeadStatus] = useState(null);
  const [lead, setLead] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    let mounted = true;
    setLoadingRates(true);
    fetch("/api/rates")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch rates");
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setRates(data);
        setLoadingRates(false);
      })
      .catch((err) => {
        setRates(FALLBACK_RATES);
        setRatesError(err.message);
        setLoadingRates(false);
      });
    return () => (mounted = false);
  }, []);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const fmtINR = (n) =>
    n == null || Number.isNaN(Number(n))
      ? "-"
      : "₹ " + Number(n).toLocaleString("en-IN");

  function localCalculate(payload) {
    const r = rates || FALLBACK_RATES;
    const areaSqft = Number(payload.area) * (payload.unit === "sqm" ? 10.7639 : 1);
    const quality = payload.materialQuality || "standard";
    const materialRate =
      (r.materialPerSqft && r.materialPerSqft[quality]) ||
      r.materialPerSqft?.standard ||
      FALLBACK_RATES.materialPerSqft.standard;
    const materialCost = Math.round(materialRate * areaSqft);
    const laborRate = payload.laborRate
      ? Number(payload.laborRate)
      : r.laborPerSqft || FALLBACK_RATES.laborPerSqft;
    const laborCost = Math.round(laborRate * areaSqft);
    const electricalPerSqft =
      (r.electrical && r.electrical[payload.electrical]) ||
      FALLBACK_RATES.electrical[payload.electrical] ||
      0;
    const plumbingPerSqft =
      (r.plumbing && r.plumbing[payload.plumbing]) ||
      FALLBACK_RATES.plumbing[payload.plumbing] ||
      0;
    const falseCeilingPerSqft =
      r.falseCeilingPerSqft || FALLBACK_RATES.falseCeilingPerSqft;
    const falseCeilingArea = payload.falseCeiling
      ? Number(payload.falseCeilingArea || 0)
      : 0;
    const falseCeilingCost = Math.round(falseCeilingPerSqft * falseCeilingArea);
    const electricalCost = Math.round(electricalPerSqft * areaSqft);
    const plumbingCost = Math.round(plumbingPerSqft * areaSqft);
    const extras = electricalCost + plumbingCost + falseCeilingCost;
    const supervisionPercent = payload.supervisionPercent
      ? Number(payload.supervisionPercent)
      : r.supervisionPercent || FALLBACK_RATES.supervisionPercent;
    const supervisionCost = Math.round(
      ((materialCost + laborCost + extras) * supervisionPercent) / 100
    );
    const transport = payload.transportCharges
      ? Number(payload.transportCharges)
      : r.transportPerKm || FALLBACK_RATES.transportPerKm;
    const contingencyPercent = payload.contingencyPercent
      ? Number(payload.contingencyPercent)
      : r.contingencyPercent || FALLBACK_RATES.contingencyPercent;
    const subtotal =
      materialCost + laborCost + extras + supervisionCost + transport;
    const contingency = Math.round((subtotal * contingencyPercent) / 100);
    const gstPercent = payload.gstPercent
      ? Number(payload.gstPercent)
      : r.gstPercent || FALLBACK_RATES.gstPercent;
    const tax = Math.round(((subtotal + contingency) * gstPercent) / 100);
    const total = subtotal + contingency + tax;
    return {
      materialCost,
      laborCost,
      extras: { electricalCost, plumbingCost, falseCeilingCost },
      supervisionCost,
      transport,
      contingency,
      tax,
      subtotal,
      total,
    };
  }

  async function calculate() {
    setCalculating(true);
    setCalcError(null);
    setCalcResult(null);
    const payload = {
      ...form,
      area: Number(form.area || 0),
      floors: Number(form.floors || 1),
      floorHeight: Number(form.floorHeight || 0),
      falseCeilingArea: Number(form.falseCeilingArea || 0),
      transportCharges: Number(form.transportCharges || 0),
      laborRate: form.laborRate ? Number(form.laborRate) : undefined,
      supervisionPercent: form.supervisionPercent
        ? Number(form.supervisionPercent)
        : undefined,
      contingencyPercent: form.contingencyPercent
        ? Number(form.contingencyPercent)
        : undefined,
      gstPercent: form.gstPercent ? Number(form.gstPercent) : undefined,
    };
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await res.text();
        throw new Error("Server calculation failed");
      }
      const data = await res.json();
      setCalcResult(data);
    } catch {
      try {
        const data = localCalculate(payload);
        setCalcResult(data);
      } catch {
        setCalcError("Calculation failed. Try again later.");
      }
    } finally {
      setCalculating(false);
    }
  }

  async function submitLead() {
    setLeadSubmitting(true);
    setLeadStatus(null);
    const payload = { lead, form, calcResult };
    try {
      const res = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit lead");
      const data = await res.json();
      setLeadStatus({ success: true, id: data.id || null });
      setShowModal(false);
      setLead({ name: "", phone: "", email: "", notes: "" });
    } catch (err) {
      setLeadStatus({ success: false, message: err.message || "Submission failed" });
    } finally {
      setLeadSubmitting(false);
    }
  }

  const canCalculate = () => {
    if (!form.area || Number(form.area) <= 0) return false;
    if (!form.materialQuality) return false;
    return true;
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-200">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-4xl font-extrabold mb-2 text-amber-400 tracking-tight">
          Construction Cost Estimator
        </h1>
        <p className="mb-8 text-slate-400 text-lg">
          Enterprise-grade cost estimation with live Indian city autocomplete and smooth animations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM SECTIONS */}
          <div className="lg:col-span-2 overflow-y-auto" style={{ maxHeight: "80vh" }}>
            <FormCard title="1. Basic Project Details">
              <ResponsiveGrid>
                <Field label="Type" htmlFor="constructionUse">
                  <Select
                    id="constructionUse"
                    value={form.constructionUse}
                    onChange={(e) => update({ constructionUse: e.target.value })}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </Select>
                </Field>
                <Field label="Construction Type" htmlFor="constructionType">
                  <Select
                    id="constructionType"
                    value={form.constructionType}
                    onChange={(e) => update({ constructionType: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="renovation">Renovation / Remodeling</option>
                    <option value="extension">Extension</option>
                  </Select>
                </Field>
                <Field label="Unit" htmlFor="unit">
                  <Select
                    id="unit"
                    value={form.unit}
                    onChange={(e) => update({ unit: e.target.value })}
                  >
                    <option value="sqft">sq ft</option>
                    <option value="sqm">sq m</option>
                  </Select>
                </Field>
              </ResponsiveGrid>
            </FormCard>

            <FormCard title="2. Area & Scope">
              <ResponsiveGrid>
                <Field label="Built-up Area" htmlFor="area">
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={(e) => update({ area: e.target.value })}
                    placeholder="e.g., 1500"
                  />
                </Field>
                <Field label="Floors" htmlFor="floors">
                  <Input
                    id="floors"
                    type="number"
                    min="1"
                    value={form.floors}
                    onChange={(e) => update({ floors: e.target.value })}
                  />
                </Field>
                <Field label="Floor Height (ft)" htmlFor="floorHeight">
                  <Input
                    id="floorHeight"
                    type="number"
                    min="0"
                    value={form.floorHeight}
                    onChange={(e) => update({ floorHeight: e.target.value })}
                  />
                </Field>
                <Field label="Plot Size / Land Area" htmlFor="plotSize">
                  <Input
                    id="plotSize"
                    type="text"
                    value={form.plotSize}
                    onChange={(e) => update({ plotSize: e.target.value })}
                    placeholder="optional"
                  />
                </Field>
              </ResponsiveGrid>
            </FormCard>

            <FormCard title="3. Material & Finish">
              <ResponsiveGrid>
                <Field label="Material Quality" htmlFor="materialQuality">
                  <Select
                    id="materialQuality"
                    value={form.materialQuality}
                    onChange={(e) => update({ materialQuality: e.target.value })}
                  >
                    <option value="economy">Economy</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </Select>
                </Field>
                <Field label="Wall Material" htmlFor="wallMaterial">
                  <Select
                    id="wallMaterial"
                    value={form.wallMaterial}
                    onChange={(e) => update({ wallMaterial: e.target.value })}
                  >
                    <option value="brick">Brick</option>
                    <option value="aac">AAC Blocks</option>
                    <option value="concrete">Concrete Blocks</option>
                  </Select>
                </Field>
                <Field label="Flooring Type" htmlFor="flooring">
                  <Select
                    id="flooring"
                    value={form.flooring}
                    onChange={(e) => update({ flooring: e.target.value })}
                  >
                    <option value="tiles">Tiles</option>
                    <option value="marble">Marble</option>
                    <option value="granite">Granite</option>
                    <option value="cement">Cement</option>
                  </Select>
                </Field>
                <Field label="Roof Type" htmlFor="roofType">
                  <Select
                    id="roofType"
                    value={form.roofType}
                    onChange={(e) => update({ roofType: e.target.value })}
                  >
                    <option value="concrete">Concrete Slab</option>
                    <option value="metal">Metal Sheet</option>
                  </Select>
                </Field>
                <Field label="Paint Quality" htmlFor="paintQuality">
                  <Select
                    id="paintQuality"
                    value={form.paintQuality}
                    onChange={(e) => update({ paintQuality: e.target.value })}
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </Select>
                </Field>
              </ResponsiveGrid>
            </FormCard>

            <FormCard title="4. Labor & Contractor">
              <ResponsiveGrid>
                <Field label="Labor Rate (Override)" htmlFor="laborRate">
                  <Input
                    id="laborRate"
                    type="number"
                    min="0"
                    value={form.laborRate}
                    onChange={(e) => update({ laborRate: e.target.value })}
                    placeholder="Leave blank to use region rate"
                  />
                </Field>
                <Field label="Skilled vs Unskilled (%)" htmlFor="skilledRatio">
                  <Input
                    id="skilledRatio"
                    type="number"
                    min="0"
                    max="100"
                    value={form.skilledRatio}
                    onChange={(e) => update({ skilledRatio: e.target.value })}
                  />
                </Field>
                <Field label="Supervision Cost (%)" htmlFor="supervisionPercent">
                  <Input
                    id="supervisionPercent"
                    type="number"
                    min="0"
                    value={form.supervisionPercent}
                    onChange={(e) => update({ supervisionPercent: e.target.value })}
                    placeholder="Default from rates"
                  />
                </Field>
              </ResponsiveGrid>
            </FormCard>

            <FormCard title="5. Additional Features">
              <ResponsiveGrid>
                <Field label="Electrical Work" htmlFor="electrical">
                  <Select
                    id="electrical"
                    value={form.electrical}
                    onChange={(e) => update({ electrical: e.target.value })}
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="smart">Smart wiring</option>
                  </Select>
                </Field>
                <Field label="Plumbing Work" htmlFor="plumbing">
                  <Select
                    id="plumbing"
                    value={form.plumbing}
                    onChange={(e) => update({ plumbing: e.target.value })}
                  >
                    <option value="standard">Standard fittings</option>
                    <option value="premium">Premium fittings</option>
                  </Select>
                </Field>
                <Field label="Doors & Windows" htmlFor="doorWindow">
                  <Select
                    id="doorWindow"
                    value={form.doorWindow}
                    onChange={(e) => update({ doorWindow: e.target.value })}
                  >
                    <option value="wood">Wood</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="upvc">UPVC</option>
                  </Select>
                </Field>
              </ResponsiveGrid>

              <div className="flex items-center mt-4 gap-3 flex-wrap">
                <input
                  id="falseCeiling"
                  type="checkbox"
                  className="accent-amber-400"
                  checked={form.falseCeiling}
                  onChange={(e) => update({ falseCeiling: e.target.checked })}
                />
                <label htmlFor="falseCeiling" className="text-sm font-medium mr-2">
                  False Ceiling (partial)
                </label>
                {form.falseCeiling && (
                  <Input
                    type="number"
                    min="0"
                    placeholder="False ceiling area (sqft)"
                    value={form.falseCeilingArea}
                    onChange={(e) => update({ falseCeilingArea: e.target.value })}
                    className="w-36 ml-2"
                  />
                )}
              </div>

              <div className="flex gap-5 mt-5 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.exteriorWork.boundaryWall}
                    onChange={(e) =>
                      update({
                        exteriorWork: {
                          ...form.exteriorWork,
                          boundaryWall: e.target.checked,
                        },
                      })
                    }
                    className="accent-amber-400"
                  />
                  Boundary wall
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.exteriorWork.landscaping}
                    onChange={(e) =>
                      update({
                        exteriorWork: {
                          ...form.exteriorWork,
                          landscaping: e.target.checked,
                        },
                      })
                    }
                    className="accent-amber-400"
                  />
                  Landscaping
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.exteriorWork.parking}
                    onChange={(e) =>
                      update({
                        exteriorWork: {
                          ...form.exteriorWork,
                          parking: e.target.checked,
                        },
                      })
                    }
                    className="accent-amber-400"
                  />
                  Parking
                </label>
              </div>
            </FormCard>

            <FormCard title="6. Location & Logistics">
              <ResponsiveGrid medCol={1} lgCol={2}>
                <Field label="City / Region" htmlFor="city">
                  <CityAutoComplete
                    value={form.city}
                    onChange={(val) => update({ city: val })}
                    placeholder="Type any Indian city or region"
                  />
                </Field>
                <Field label="Transport (₹)" htmlFor="transportCharges">
                  <Input
                    id="transportCharges"
                    type="number"
                    value={form.transportCharges}
                    onChange={(e) => update({ transportCharges: e.target.value })}
                    placeholder="optional"
                  />
                </Field>
              </ResponsiveGrid>
            </FormCard>

            <FormCard title="7. Contingency & Tax">
              <ResponsiveGrid medCol={1} lgCol={2}>
                <Field label="Contingency (%)" htmlFor="contingencyPercent">
                  <Input
                    id="contingencyPercent"
                    type="number"
                    value={form.contingencyPercent}
                    onChange={(e) => update({ contingencyPercent: e.target.value })}
                    placeholder={`default ${rates?.contingencyPercent ?? 7}%`}
                  />
                </Field>
                <Field label="GST (%)" htmlFor="gstPercent">
                  <Input
                    id="gstPercent"
                    type="number"
                    value={form.gstPercent}
                    onChange={(e) => update({ gstPercent: e.target.value })}
                    placeholder={`default ${rates?.gstPercent ?? 18}%`}
                  />
                </Field>
              </ResponsiveGrid>
            </FormCard>
          </div>

          {/* SUMMARY PANEL */}
          <motion.div
            className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-600 sticky top-6 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-amber-400 font-bold text-xl mb-4">Quick Summary</h3>
            <div className="mb-4 text-lg text-slate-200">
              <p><strong>Area:</strong> {form.area || "-"} {form.unit}</p>
              <p><strong>Material Quality:</strong> {form.materialQuality || "-"}</p>
            </div>
            <button
              onClick={calculate}
              disabled={!canCalculate() || calculating}
              aria-disabled={!canCalculate() || calculating}
              className="w-full mb-3 py-3 text-black font-semibold rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:scale-105 focus:ring-4 focus:ring-amber-700 transition transform"
            >
              {calculating ? "Calculating..." : "Calculate"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 font-semibold transition"
            >
              Get Exact Quote
            </button>
            <div className="mt-3 text-sm text-slate-400">
              Rates source:{" "}
              <span className="font-semibold">
                {loadingRates ? "Loading..." : ratesError ? "Fallback" : "Server"}
              </span>
              {ratesError && <p className="text-red-500 mt-2">{ratesError}</p>}
            </div>
            {calcResult && (
              <div className="mt-6 text-slate-300 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Material</span>
                  <span>{fmtINR(calcResult.materialCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor</span>
                  <span>{fmtINR(calcResult.laborCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Electrical</span>
                  <span>{fmtINR(calcResult.extras.electricalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plumbing</span>
                  <span>{fmtINR(calcResult.extras.plumbingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>False Ceiling</span>
                  <span>{fmtINR(calcResult.extras.falseCeilingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supervision</span>
                  <span>{fmtINR(calcResult.supervisionCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport</span>
                  <span>{fmtINR(calcResult.transport)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Contingency</span>
                  <span>{fmtINR(calcResult.contingency)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tax/GST</span>
                  <span>{fmtINR(calcResult.tax)}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold text-xl border-t border-slate-700 pt-3">
                  <span>Total</span>
                  <span>{fmtINR(calcResult.total)}</span>
                </div>
              </div>
            )}
            {calcError && (
              <div className="mt-4 text-sm text-red-600">{calcError}</div>
            )}
          </motion.div>
        </div>

        {/* Floating Request CTA Button for Mobile */}
        <button
          onClick={() => setShowModal(true)}
          aria-label="Request Callback"
          className="fixed right-6 bottom-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-4 shadow-xl text-black font-bold hover:scale-105 transform transition"
        >
          Request Callback
        </button>

        {/* Modal with motion and accessibility */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-modal="true"
              role="dialog"
            >
              <motion.div
                className="w-full max-w-lg rounded-3xl bg-slate-800 p-8 shadow-2xl text-white"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                aria-label="Request quote modal"
              >
                <h2 className="mb-4 text-2xl font-bold text-amber-400">
                  Request Detailed Quote
                </h2>
                <p className="mb-6 text-slate-300 text-sm">
                  Our team will contact you within 24 hours with a detailed BOQ and timeline.
                </p>

                <label className="block mb-3">
                  <span className="block mb-1 text-sm font-medium">Full Name</span>
                  <input
                    type="text"
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    className="w-full rounded-lg py-2 px-3 bg-slate-700 border border-slate-600 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition text-white"
                    required
                    aria-required="true"
                    aria-label="Full name"
                  />
                </label>
                <label className="block mb-3">
                  <span className="block mb-1 text-sm font-medium">Phone</span>
                  <input
                    type="tel"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="w-full rounded-lg py-2 px-3 bg-slate-700 border border-slate-600 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition text-white"
                    required
                    aria-required="true"
                    aria-label="Phone number"
                  />
                </label>
                <label className="block mb-3">
                  <span className="block mb-1 text-sm font-medium">Email (optional)</span>
                  <input
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="w-full rounded-lg py-2 px-3 bg-slate-700 border border-slate-600 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition text-white"
                    aria-label="Email"
                  />
                </label>
                <label className="block mb-6">
                  <span className="block mb-1 text-sm font-medium">Additional Notes (optional)</span>
                  <textarea
                    rows="4"
                    value={lead.notes}
                    onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                    className="w-full rounded-lg py-2 px-3 resize-none bg-slate-700 border border-slate-600 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition text-white"
                    aria-label="Additional notes"
                  />
                </label>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition text-white font-semibold"
                    aria-label="Cancel request"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitLead}
                    disabled={leadSubmitting}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold hover:scale-105 transform transition disabled:opacity-70"
                    aria-label="Submit request"
                  >
                    {leadSubmitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
                {leadStatus && (
                  <p className={`mt-4 text-sm ${leadStatus.success ? "text-green-500" : "text-red-500"}`} role="alert">
                    {leadStatus.success
                      ? `Request received (id: ${leadStatus.id || "-"})`
                      : `Error: ${leadStatus.message}`}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

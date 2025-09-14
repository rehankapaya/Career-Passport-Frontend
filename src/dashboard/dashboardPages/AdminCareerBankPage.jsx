import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { apiurl } from "../../api";
import { Plus, List, Grid2X2, Search, Edit3, Trash2, X, Layers, SlidersHorizontal, DollarSign } from "lucide-react";

const CACHE_KEY = "careers_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items, savedAt: Date.now() }));
  } catch {}
}

function upsertList(list, item) {
  const next = Array.isArray(list) ? [...list] : [];
  const idx = next.findIndex((x) => String(x._id) === String(item._id));
  if (idx >= 0) next[idx] = item;
  else next.unshift(item);
  return next;
}

function removeFromList(list, id) {
  return (Array.isArray(list) ? list : []).filter((x) => String(x._id) !== String(id));
}

const AdminCareerBankPage = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [domainFilter, setDomainFilter] = useState("all");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    required_skills: "",
    education_path: "",
    expected_salary: "",
  });

  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length) {
      setCareers(cached);
      setFilteredCareers(cached);
      setLoading(false);
    } else {
      fetchCareers();
    }
  }, []);

  const domains = useMemo(() => {
    const set = new Set(careers.map((c) => c.domain).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [careers]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const min = minSalary !== "" ? Number(minSalary) : null;
    const max = maxSalary !== "" ? Number(maxSalary) : null;
    const next = careers.filter((c) => {
      const t = c.title?.toLowerCase() || "";
      const d = c.domain?.toLowerCase() || "";
      const desc = c.description?.toLowerCase() || "";
      const skills = Array.isArray(c.required_skills) ? c.required_skills.join(" ").toLowerCase() : "";
      const matchesSearch = term ? [t, d, desc, skills].some((s) => s.includes(term)) : true;
      const matchesDomain = domainFilter === "all" ? true : d === domainFilter.toLowerCase();
      const sal = typeof c.expected_salary === "number" ? c.expected_salary : Number(c.expected_salary || 0);
      const matchesMin = min != null ? sal >= min : true;
      const matchesMax = max != null ? sal <= max : true;
      return matchesSearch && matchesDomain && matchesMin && matchesMax;
    });
    setFilteredCareers(next);
  }, [searchTerm, careers, domainFilter, minSalary, maxSalary]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/api/careers`, { withCredentials: true });
      setCareers(response.data || []);
      setFilteredCareers(response.data || []);
      writeCache(response.data || []);
    } catch {
      setMessage("Failed to fetch careers");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "expected_salary") {
      const clean = value.replace(/[^\d.]/g, "");
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title || "",
      description: career.description || "",
      domain: career.domain || "",
      required_skills: Array.isArray(career.required_skills) ? career.required_skills.join(", ") : career.required_skills || "",
      education_path: career.education_path || "",
      expected_salary: career.expected_salary != null ? String(career.expected_salary) : "",
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const skillsArray = formData.required_skills ? formData.required_skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const salaryNumber = formData.expected_salary === "" ? null : Number(formData.expected_salary);
      if (salaryNumber != null && Number.isNaN(salaryNumber)) {
        setMessage("Expected salary must be a valid number.");
        setFormLoading(false);
        return;
      }
      const payload = {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        required_skills: skillsArray,
        education_path: formData.education_path,
        expected_salary: salaryNumber,
      };

      if (editingCareer) {
        const { data: updated } = await axios.put(`${apiurl}/api/careers/${editingCareer._id}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        });
        const next = upsertList(careers, updated || { ...editingCareer, ...payload, _id: editingCareer._id });
        setCareers(next);
        setFilteredCareers(next);
        writeCache(next);
        setMessage("Career updated successfully!");
      } else {
        const { data: created } = await axios.post(`${apiurl}/api/careers`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        });
        const next = upsertList(careers, created || payload);
        setCareers(next);
        setFilteredCareers(next);
        writeCache(next);
        setMessage("Career added successfully!");
      }

      resetForm();
    } catch (error) {
      if (error.response?.status === 400) setMessage("All required fields must be provided.");
      else if (error.response?.status === 401) setMessage("Unauthorized. Please log in as admin.");
      else setMessage("Server error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this career?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiurl}/api/careers/${id}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      const next = removeFromList(careers, id);
      setCareers(next);
      setFilteredCareers(next);
      writeCache(next);
      setMessage("Career deleted successfully!");
    } catch {
      setMessage("Failed to delete career");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", domain: "", required_skills: "", education_path: "", expected_salary: "" });
    setEditingCareer(null);
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatSalary = (n) => {
    if (n == null) return "-";
    try {
      return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    } catch {
      return String(n);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "#666" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #f3f3f3", borderTop: "4px solid #0A66C2", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 15 }} />
        <p>Loading careers...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 15 }}>
        <h1 style={{ color: "#1D2226", margin: 0 }}>Career Bank Management</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setShowAddForm(!showAddForm)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", backgroundColor: "#0A66C2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, boxShadow: "0 6px 18px rgba(10,102,194,0.25)" }}>
            {showAddForm ? <List size={18} /> : <Plus size={18} />}
            {showAddForm ? "View Careers" : "Add New Career"}
          </button>
          {!showAddForm && (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setViewMode("list")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", backgroundColor: viewMode === "list" ? "#0A66C2" : "#F3F6F8", color: viewMode === "list" ? "#fff" : "#1D2226", border: "1px solid", borderColor: viewMode === "list" ? "#0A66C2" : "#E6E9EC", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                <List size={16} />
                List
              </button>
              <button onClick={() => setViewMode("grid")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", backgroundColor: viewMode === "grid" ? "#0A66C2" : "#F3F6F8", color: viewMode === "grid" ? "#fff" : "#1D2226", border: "1px solid", borderColor: viewMode === "grid" ? "#0A66C2" : "#E6E9EC", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                <Grid2X2 size={16} />
                Grid
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div style={{ padding: "12px 16px", borderRadius: 10, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, backgroundColor: message.toLowerCase().includes("success") ? "#E8F3FF" : "#FDE7E9", color: message.toLowerCase().includes("success") ? "#0A66C2" : "#B42318", border: `1px solid ${message.toLowerCase().includes("success") ? "#BBD7FF" : "#F2C2C0"}` }}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "inherit", display: "inline-flex" }}>
            <X size={18} />
          </button>
        </div>
      )}

      {!showAddForm && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 220px 220px", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <Search size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title, description, skill..." style={{ width: "100%", padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
          </div>
          <div style={{ position: "relative" }}>
            <SlidersHorizontal size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} style={{ width: "100%", padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none", background: "#fff" }}>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Domains" : d}
                </option>
              ))}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <DollarSign size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input inputMode="numeric" value={minSalary} onChange={(e) => setMinSalary(e.target.value.replace(/[^\d]/g, ""))} placeholder="Min salary" style={{ width: "100%", padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
          </div>
          <div style={{ position: "relative" }}>
            <DollarSign size={16} color="#6B7280" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input inputMode="numeric" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value.replace(/[^\d]/g, ""))} placeholder="Max salary" style={{ width: "100%", padding: "12px 14px 12px 36px", border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
          </div>
        </div>
      )}

      {showAddForm ? (
        <div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", marginBottom: 20 }}>
          <h2 style={{ textAlign: "center", color: "#1D2226", marginBottom: 20, fontSize: 22, fontWeight: 700 }}>{editingCareer ? "Edit Career" : "Add New Career"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Software Engineer" style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Domain *</label>
                <input type="text" name="domain" value={formData.domain} onChange={handleChange} required placeholder="e.g., Information Technology" style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Role overview, typical responsibilities..." rows={4} style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none", resize: "vertical", minHeight: 100 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Layers size={16} /> Required Skills * (comma-separated)
              </label>
              <input type="text" name="required_skills" value={formData.required_skills} onChange={handleChange} required placeholder="Programming, Problem Solving, Algorithms, Teamwork" style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Education Path *</label>
              <input type="text" name="education_path" value={formData.education_path} onChange={handleChange} required placeholder="e.g., Bachelor's degree in CS or related field" style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontWeight: 700, color: "#1D2226", fontSize: 14 }}>Expected Salary *</label>
              <input type="text" name="expected_salary" value={formData.expected_salary} onChange={handleChange} required placeholder="e.g., 85000" style={{ padding: 12, border: "1px solid #E6E9EC", borderRadius: 10, fontSize: 15, outline: "none" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 6 }}>
              <button type="button" onClick={resetForm} style={{ padding: "10px 16px", backgroundColor: "#F3F6F8", color: "#1D2226", border: "1px solid #E6E9EC", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button type="submit" disabled={formLoading} style={{ padding: "10px 16px", backgroundColor: formLoading ? "#7AA9D8" : "#0A66C2", color: "#fff", border: "none", borderRadius: 10, cursor: formLoading ? "not-allowed" : "pointer", fontWeight: 700, boxShadow: "0 6px 18px rgba(10,102,194,0.25)" }}>
                {formLoading ? (editingCareer ? "Updating..." : "Adding...") : editingCareer ? "Update Career" : "Add Career"}
              </button>
            </div>
          </form>
        </div>
      ) : filteredCareers.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#6B7280", backgroundColor: "#F3F6F8", borderRadius: 12 }}>
          <h3 style={{ margin: 0, color: "#1D2226" }}>No careers found</h3>
          <p style={{ marginTop: 8 }}>{searchTerm || domainFilter !== "all" || minSalary !== "" || maxSalary !== "" ? "Try adjusting filters" : "Add the first career to get started"}</p>
        </div>
      ) : viewMode === "list" ? (
        <div style={{ backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 1fr 1fr", padding: "14px 18px", backgroundColor: "#F3F6F8", fontWeight: 700, color: "#1D2226", borderBottom: "1px solid #E6E9EC" }}>
            <div>Title</div>
            <div>Domain</div>
            <div>Salary</div>
            <div>Created</div>
            <div>Actions</div>
          </div>
          {filteredCareers.map((career) => (
            <div key={career._id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 1fr 1fr", padding: "14px 18px", borderBottom: "1px solid #E6E9EC", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#1D2226", marginBottom: 4 }}>{career.title}</div>
                <div style={{ color: "#6B7280", fontSize: 14 }}>{career.description?.length > 110 ? `${career.description.substring(0, 110)}...` : career.description}</div>
                {Array.isArray(career.required_skills) && career.required_skills.length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {career.required_skills.slice(0, 6).map((s, i) => (
                      <span key={i} style={{ padding: "4px 8px", backgroundColor: "#F3F6F8", color: "#1D2226", borderRadius: 999, fontSize: 12, border: "1px solid #E6E9EC", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Layers size={12} /> {s}
                      </span>
                    ))}
                    {career.required_skills.length > 6 && <span style={{ padding: "4px 8px", backgroundColor: "#EEF2FF", color: "#1D2226", borderRadius: 999, fontSize: 12, border: "1px solid #C7D2FE" }}>+{career.required_skills.length - 6} more</span>}
                  </div>
                )}
              </div>
              <div>
                <span style={{ padding: "4px 10px", backgroundColor: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{career.domain}</span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "#1D2226" }}>{formatSalary(career.expected_salary)}</span>
              </div>
              <div>{formatDate(career.createdAt)}</div>
              <div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleEditClick(career)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "#16A34A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(career._id)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {filteredCareers.map((career) => (
            <div key={career._id} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 10px 24px rgba(0,0,0,0.06)", transition: "transform .2s ease, box-shadow .2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: "#1D2226", fontSize: 18, fontWeight: 700, flex: 1 }}>{career.title}</h3>
                <span style={{ padding: "4px 8px", backgroundColor: "#E8F3FF", color: "#0A66C2", borderRadius: 999, fontSize: 12, fontWeight: 700, marginLeft: 10 }}>{career.domain}</span>
              </div>
              <p style={{ color: "#6B7280", marginBottom: 12, lineHeight: 1.55 }}>{career.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#6B7280" }}>
                <span>{formatSalary(career.expected_salary)}</span>
                <span>{formatDate(career.createdAt)}</span>
              </div>
              {Array.isArray(career.required_skills) && career.required_skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {career.required_skills.map((s, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", backgroundColor: "#F3F6F8", color: "#1D2226", borderRadius: 999, fontSize: 12, border: "1px solid #E6E9EC" }}>
                      <Layers size={12} /> {s}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEditClick(career)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#16A34A", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, flex: 1 }}>
                  <Edit3 size={16} />
                  Edit
                </button>
                <button onClick={() => handleDelete(career._id)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, flex: 1 }}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

try {
  const sheet = document.styleSheets?.[0];
  if (sheet) sheet.insertRule(`@keyframes spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }`, sheet.cssRules.length);
} catch {}

export default AdminCareerBankPage;

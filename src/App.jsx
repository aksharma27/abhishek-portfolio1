import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Pencil, Trash2 } from "lucide-react";

// --- 1. SUPABASE CONFIG ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 2. CRASH-PROOF ICONS (No external libraries needed) ---
const Icons = {
  Briefcase: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 10h20M2 14h20M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10"/></svg>,
  GraduationCap: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Code: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>,
  Message: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Send: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Camera: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Link: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  LogOut: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Github: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  Linkedin: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Twitter: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 4a10.9 10.9 0 0 1-3.14.86 4.48 4.48 0 0 0 2.4-3.03 9.04 9.04 0 0 1-2.85 1.09 4.48 4.48 0 0 0-7.63 4.08A12.74 12.74 0 0 1 1.67 3.15a4.48 4.48 0 0 0 1.39 5.98 4.47 4.47 0 0 1-2.03-.56v.05a4.48 4.48 0 0 0 3.59 4.39 4.48 4.48 0 0 1-2.02.08 4.48 4.48 0 0 0 4.18 3.11 8.98 8.98 0 0 1-6.56 1.86A12.68 12.68 0 0 0 7 21c8.4 0 13-6.96 13-13v-.59A9.3 9.3 0 0 0 22 4z"/></svg>,
  Instagram: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Youtube: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>,
  WhatsApp: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Mail: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
};

// --- 3. INLINE CSS (No App.css needed) ---
const globalCSS = `
  :root { --bg-main: #020617; --bg-card: #0f172a; --bg-input: #1e293b; --text-main: #f8fafc; --text-muted: #94a3b8; --primary: #6366f1; --primary-hover: #4f46e5; --border: #1e293b; --border-hover: #334155; --danger: #f43f5e; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background-color: var(--bg-main); color: var(--text-main); line-height: 1.5; overflow-x: hidden; }
  .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 10; }
  
  /* Hero Section (Video + Mountains + Typing) */
  .hero-wrapper { position: relative; height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000; }
  .hero-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.8; }
  .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.8) 100%); z-index: 2; }
  
  /* Shooting Star Animation */
  .shooting-star { position: absolute; top: 10%; left: 60%; width: 150px; height: 2px; background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)); transform: rotate(-45deg); z-index: 3; opacity: 0; animation: shooting 4s linear infinite; }
  .shooting-star::before { content: ''; position: absolute; top: -3px; right: 0; width: 8px; height: 8px; background: white; border-radius: 50%; box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.8); }
  @keyframes shooting { 0% { transform: translate(0, 0) rotate(-45deg); opacity: 1; } 15% { transform: translate(-300px, 300px) rotate(-45deg); opacity: 0; } 100% { opacity: 0; } }

  /* Mountain Silhouette */
  .mountains { position: absolute; bottom: -2px; left: 0; width: 100%; height: 35vh; z-index: 4; }
  
  /* Typography / Typing Effect */
  .hero-content { z-index: 5; text-align: center; display: flex; flex-direction: column; align-items: center; }
  .typing-container { display: inline-block; }
  .typing-text { font-size: 3.5rem; font-weight: 900; color: #ffffff; overflow: hidden; white-space: nowrap; border-right: 4px solid #ffffff; width: 0; animation: typing 2.5s steps(20, end) forwards, blink 0.8s step-end infinite; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
  @media(min-width: 768px) { .typing-text { font-size: 5rem; } }
  @keyframes typing { from { width: 0 } to { width: 100% } }
  @keyframes blink { from, to { border-color: transparent } 50% { border-color: #ffffff } }
  .hero-subtitle { color: #cbd5e1; font-size: 1.1rem; max-width: 600px; margin-top: 20px; text-shadow: 0 2px 8px rgba(0,0,0,0.5); opacity: 0; animation: fadeIn 1s ease 2.5s forwards; }
  @keyframes fadeIn { to { opacity: 1; } }

  /* Header */
  .header { position: absolute; top: 0; width: 100%; z-index: 100; height: 80px; display: flex; align-items: center; }
  .logo { font-size: 1.25rem; font-weight: bold; display: flex; align-items: center; gap: 8px; text-decoration: none; color: white; }
  .logo-icon { background: var(--primary); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: monospace; }
  .logo-icon img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
  .nav-links { display: flex; align-items: center; gap: 16px; }
  .blog-btn { display: flex; align-items: center; gap: 6px; padding: 8px 20px; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; text-decoration: none; font-size: 0.875rem; transition: 0.2s; backdrop-filter: blur(5px); }
  .blog-btn:hover { background: rgba(255,255,255,0.2); border-color: white; }
  .logout-btn { background: rgba(244, 63, 94, 0.2); border: 1px solid var(--danger); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; }

  /* Content Sections */
  section.content { padding: 80px 0; border-bottom: 1px solid var(--border); }
  .section-title { font-size: 1.5rem; display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-weight: bold; }
  .section-title svg { color: var(--primary); }
  
  /* Grids */
  .grid-2 { display: grid; grid-template-columns: 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr; gap: 32px; }
  @media(min-width: 768px) { .grid-2 { grid-template-columns: 1fr 1fr; } .grid-3 { grid-template-columns: 2fr 1fr; } }

  /* Cards & Timeline */
  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .timeline { border-left: 2px solid var(--border); padding-left: 16px; margin-left: 8px; display: flex; flex-direction: column; gap: 24px; }
  .timeline-item { position: relative; }
  .timeline-dot { position: absolute; left: -21px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--border-hover); }
  .timeline-dot.active { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
  .timeline-title { font-weight: 600; color: white; }
  .timeline-company { color: var(--primary); font-size: 0.875rem; font-weight: 500; }
  .timeline-date { color: var(--text-muted); font-size: 0.75rem; }

  /* Skills */
  .skills-container { display: flex; flex-wrap: wrap; gap: 10px; }
  .skill-tag { background: var(--bg-input); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; font-size: 0.875rem; font-family: monospace; color: var(--text-main); }

  /* Testimonials */
  .testimonial-list.scrollable { max-height: 70vh; overflow-y: auto; overscroll-behavior: contain; padding-right: 8px; }
  .testimonial-item { background: var(--bg-card); border: 1px solid var(--border); padding: 20px; border-radius: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
  .testimonial-text { font-style: italic; color: #cbd5e1; font-size: 0.95rem; }
  .testimonial-author { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; }
  .author-info { display: flex; align-items: center; gap: 12px; }
  .testimonial-admin-actions { display: flex; gap: 8px; }
  .testimonial-action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-hover); border-radius: 6px; background: var(--bg-input); color: var(--text-muted); cursor: pointer; }
  .testimonial-action-btn:hover { color: white; border-color: var(--primary); }
  .testimonial-action-btn.delete:hover { border-color: var(--danger); color: var(--danger); }
  .avatar-wrapper { position: relative; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; background: var(--bg-input); display: flex; align-items: center; justify-content: center; color: var(--primary); }
  .admin-edit-btn { position: absolute; bottom: -4px; right: -4px; background: var(--primary); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

  /* Forms */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg-input); border: 1px solid var(--border); color: white; padding: 10px 12px; border-radius: 8px; font-family: inherit; outline: none; }
  .form-input:focus { border-color: var(--primary); }
  .btn-primary { width: 100%; background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
  .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Footer & Modals */
  .footer { padding: 40px 24px 24px; display: flex; flex-direction: column; gap: 24px; align-items: center; color: var(--text-muted); }
  .footer-bottom { display: flex; width: 100%; max-width: 1000px; justify-content: center; align-items: center; border-top: 1px solid var(--border); padding-top: 24px; position: relative; }
  .footer-copyright { width: 100%; text-align: center; }
  .footer-admin-button { position: absolute; top: 24px; right: 0; }
  @media(max-width: 420px) { .footer-bottom { padding-bottom: 40px; } .footer-admin-button { top: auto; right: 50%; bottom: 0; transform: translateX(50%); } }
  .social-icon { color: var(--text-muted); transition: all 0.2s ease; text-decoration: none; }
  .social-icon:hover { color: var(--primary); transform: translateY(-3px); }
  .lock-btn { background: none; border: none; color: var(--border-hover); cursor: pointer; }
  .lock-btn:hover { color: var(--text-muted); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal-content { background: var(--bg-card); border: 1px solid var(--border); width: 100%; max-width: 350px; padding: 24px; border-radius: 12px; }
  .testimonial-modal { max-width: 480px; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-weight: 600; }
  .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; }
`;

// Helper: Compress image to Base64 to save directly into DB text field
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 300;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } 
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function App() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", text: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [targetEditId, setTargetEditId] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editTestimonialForm, setEditTestimonialForm] = useState({ name: "", email: "", text: "" });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const editImageInputRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAdmin(!!session);
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
      });
    }
  }, []);

  const fetchTestimonials = async () => {
    if (supabase) {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (!error && data) setTestimonials(data);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await compressImage(file);
      setForm({ ...form, image: base64 });
    } catch (err) { alert("Image error"); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.text) return alert("Fill all fields");
    setSubmitting(true);
    
    const newEntry = { name: form.name, email: form.email, text: form.text, image: form.image };
    if (supabase) {
      const { error } = await supabase.from('testimonials').insert([newEntry]);
      if (error) {
        console.error("Supabase Error Details:", error);
        alert("Database Error: " + error.message);
      } else {
        fetchTestimonials();
      }
    }
    setForm({ name: "", email: "", text: "", image: "" });
    setSubmitting(false);
    alert("Testimonial added!");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
      if (error) alert(error.message);
      else setShowAdminModal(false);
    }
  };

  const handleAdminImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !targetEditId) return;
    const base64 = await compressImage(file);
    if (supabase) {
      await supabase.from('testimonials').update({ image: base64 }).eq('id', targetEditId);
      fetchTestimonials();
    }
    setTargetEditId(null);
  };

  const openTestimonialEditor = (testimonial) => {
    setEditingTestimonial(testimonial);
    setEditTestimonialForm({ name: testimonial.name, email: testimonial.email, text: testimonial.text });
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setSavingTestimonial(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .update(editTestimonialForm)
        .eq("id", editingTestimonial.id);
      if (error) throw error;
      setTestimonials((current) => current.map((testimonial) =>
        testimonial.id === editingTestimonial.id
          ? { ...testimonial, ...editTestimonialForm }
          : testimonial
      ));
      setEditingTestimonial(null);
    } catch (error) {
      alert(`Could not update testimonial: ${error.message}`);
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (testimonial) => {
    if (!window.confirm(`Delete the testimonial from ${testimonial.name}?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", testimonial.id);
    if (error) {
      alert(`Could not delete testimonial: ${error.message}`);
      return;
    }
    setTestimonials((current) => current.filter((item) => item.id !== testimonial.id));
  };

  const skills = [
    "Java", "Spring Boot", "AWS", "React", "TypeScript",
    "Render", "Vercel", "Netlify", "DSA", "Full Stack Dev",
    "Distributed Systems", "Microservices", "Microfrontend", "Webpack", "nodejs", 
    "expressjs", "SEO", "supabase", "MongoDB", "PostgresSQL", "Javascript", "Python"
  ];

  return (
    <div>
      <style>{globalCSS}</style>
      <input type="file" accept="image/*" ref={editImageInputRef} onChange={handleAdminImageUpload} style={{ display: 'none' }} />

      {/* --- HERO SECTION WITH VIDEO, MOUNTAINS, AND TYPING --- */}
      <section className="hero-wrapper">
        <header className="header">
          <div className="container" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <a href="#" className="logo">
              <span className="logo-icon"><img src="/me.png" alt="" /></span> Abhishek
            </a>
            <nav className="nav-links">
              <a href="https://your-blog.com" target="_blank" rel="noreferrer" className="blog-btn">
                Blogs <Icons.Link />
              </a>
              {isAdmin && (
                <button onClick={() => supabase.auth.signOut()} className="logout-btn">
                  <Icons.LogOut /> Logout
                </button>
              )}
            </nav>
          </div>
        </header>

        {/* Free Starry Night Video Background */}
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        
        {/* CSS Shooting Star */}
        <div className="shooting-star"></div>

        {/* Typography Content */}
        <div className="hero-content">
          <div className="typing-container">
            <h1 className="typing-text">Hi, I am Abhishek.</h1>
          </div>
          <p className="hero-subtitle">
            24-year-old Full Stack Engineer with expertise in building resilient distributed systems, high-throughput backend systems, frontends. Expertise in Java, Springboot, NodeJs, AI integrations, LLMs, etc.
          </p>
        </div>

        {/* Himalayan Mountains SVG Silhouette Blending into the site */}
        <svg className="mountains" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0f172a" fillOpacity="0.6" d="M0,192L60,181.3C120,171,240,149,360,165.3C480,181,600,235,720,224C840,213,960,139,1080,117.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          <path fill="#020617" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </section>

      {/* --- REST OF THE PORTFOLIO --- */}
      <main className="container">
        <section className="content grid-2">
          <div className="card">
            <h2 className="section-title"><Icons.Briefcase /> Experience</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot active"></div>
                <div className="timeline-title">SDE-1 (2025-present)</div>
                <div className="timeline-company">Philips</div>
                <div className="timeline-date">Full-Time</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-title">SDE Intern(2024-2025)</div>
                <div className="timeline-company">Philips</div>
                <div className="timeline-date">Internship</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-title">Intern(2023-2024)</div>
                <div className="timeline-company">HighRadius</div>
                <div className="timeline-date">Internship</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title"><Icons.GraduationCap /> Education</h2>
            <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Graduating Class of 2025</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'white' }}>B.Tech in Computer Science</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>SOA University(2021-2025)</div>
            </div>
          </div>
        </section>

        <section className="content">
          <h2 className="section-title"><Icons.Code /> Technical Stack</h2>
          <div className="skills-container">
            {skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
          </div>
        </section>

        <section className="content grid-3">
          <div>
            <h2 className="section-title"><Icons.Message /> Client Testimonials</h2>
            <div className={`testimonial-list${testimonials.length > 3 ? " scrollable" : ""}`}>
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-item">
                  <div className="testimonial-text">"{t.text}"</div>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <div className="avatar-wrapper">
                        {t.image ? <img src={t.image} className="avatar" alt="Avatar" /> : <div className="avatar"><Icons.User /></div>}
                        {isAdmin && (
                          <button onClick={() => { setTargetEditId(t.id); editImageInputRef.current?.click(); }} className="admin-edit-btn">
                            <Icons.Camera />
                          </button>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>{t.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.email}</div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="testimonial-admin-actions">
                        <button type="button" className="testimonial-action-btn" title="Edit testimonial" aria-label={`Edit testimonial from ${t.name}`} onClick={() => openTestimonialEditor(t)}>
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button type="button" className="testimonial-action-btn delete" title="Delete testimonial" aria-label={`Delete testimonial from ${t.name}`} onClick={() => handleDeleteTestimonial(t)}>
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '16px', color: 'white' }}>Write a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" required className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" required className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Profile Photo (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Review</label>
                <textarea rows="4" required className="form-input" value={form.text} onChange={e => setForm({...form, text: e.target.value})}></textarea>
              </div>
              <button type="submit" disabled={submitting || uploading} className="btn-primary">
                <Icons.Send /> {submitting ? "Publishing..." : "Submit Review"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com/aksharma27" target="_blank" className="social-icon" title="GitHub"><Icons.Github /></a>
          <a href="http://linkedin.com/in/abhi27crj" target="_blank" className="social-icon" title="LinkedIn"><Icons.Linkedin /></a>
          <a href="https://x.com/abhishekcrj" target="_blank" className="social-icon" title="X (Twitter)"><Icons.Twitter /></a>
          <a href="https://www.instagram.com/sharma.abhi27/" target="_blank" className="social-icon" title="Instagram"><Icons.Instagram /></a>
          <a href="https://www.youtube.com/@AbhishekSharma-me" target="_blank" className="social-icon" title="YouTube"><Icons.Youtube /></a>
          <a href="https://wa.me/9142998113" target="_blank" className="social-icon" title="WhatsApp"><Icons.WhatsApp /></a>
          <a href="mailto:aksharma.27mjm@gmail.com" className="social-icon" title="Email"><Icons.Mail /></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">© {new Date().getFullYear()} Abhishek. All rights reserved.</div>
          <button onClick={() => setShowAdminModal(true)} className="lock-btn footer-admin-button" title="Admin Login" aria-label="Admin Login">
            <Icons.Lock />
          </button>
        </div>
      </footer>

      {editingTestimonial && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingTestimonial(null); }}>
          <div className="modal-content testimonial-modal" role="dialog" aria-modal="true" aria-labelledby="edit-testimonial-title">
            <div className="modal-header">
              <span id="edit-testimonial-title" style={{ color: 'white' }}>Edit Testimonial</span>
              <button type="button" onClick={() => setEditingTestimonial(null)} className="close-btn" aria-label="Close">&times;</button>
            </div>
            <form onSubmit={handleUpdateTestimonial}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-testimonial-name">Name</label>
                <input id="edit-testimonial-name" type="text" required className="form-input" value={editTestimonialForm.name} onChange={(event) => setEditTestimonialForm({ ...editTestimonialForm, name: event.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-testimonial-email">Email</label>
                <input id="edit-testimonial-email" type="email" required className="form-input" value={editTestimonialForm.email} onChange={(event) => setEditTestimonialForm({ ...editTestimonialForm, email: event.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-testimonial-text">Review</label>
                <textarea id="edit-testimonial-text" rows="4" required className="form-input" value={editTestimonialForm.text} onChange={(event) => setEditTestimonialForm({ ...editTestimonialForm, text: event.target.value })} />
              </div>
              <button type="submit" disabled={savingTestimonial} className="btn-primary">
                {savingTestimonial ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{ color: 'white' }}>Admin Login</span>
              <button onClick={() => setShowAdminModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" required className="form-input" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" required className="form-input" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

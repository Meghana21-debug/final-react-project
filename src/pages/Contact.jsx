import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current.focus(); }, []);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  const change = (e) => { setSent(false); setForm({ ...form, [e.target.name]: e.target.value }); };

  return (
    <div className="narrow">
      <h1>Contact Us</h1>
      {sent && <p className="success">✅ Thanks! We'll get back to you soon.</p>}
      <form className="card" onSubmit={submit} noValidate>
        <label>Name</label>
        <input ref={nameRef} name="name" value={form.name} onChange={change} />
        {errors.name && <small className="error">{errors.name}</small>}

        <label>Email</label>
        <input name="email" value={form.email} onChange={change} />
        {errors.email && <small className="error">{errors.email}</small>}

        <label>Message</label>
        <textarea name="message" rows="4" value={form.message} onChange={change} />
        {errors.message && <small className="error">{errors.message}</small>}

        <button className="btn" type="submit">Send message</button>
      </form>
    </div>
  );
}
import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  var [form,    setForm]    = useState({ name: "", email: "", message: "" });
  var [status,  setStatus]  = useState("idle");
  var [errMsg,  setErrMsg]  = useState("");

  function handleChange(field) {
    return function(e) {
      setForm(function(p) {
        var n = Object.assign({}, p);
        n[field] = e.target.value;
        return n;
      });
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed");
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(function(err) {
        setStatus("error");
        setErrMsg(err.message);
      });
  }

  return (
    <section className="contact section" id="contact">
      <div className="container">

        <div className="section-label">Contact</div>

        <div className="contact__layout">

          <div className="contact__left glass-card floating-element ag-interact" style={{ transitionDuration: '0.1s' }}>
            <h2 className="contact__title">
              Let's build
              <br />
              <em className="contact__title-em">something real.</em>
            </h2>

            <p className="contact__copy">
              Open to quant roles, research collaborations,
              and problems worth solving. If it's interesting,
              reach out.
            </p>

            <div className="contact__socials">
              <a href="mailto:agarwalaadarsh.work@gmail.com" className="contact__social">
                <span className="contact__social-label">Email</span>
                <span className="contact__social-value">agarwalaadarsh.work@gmail.com</span>
                <span className="contact__social-arrow">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/adarsh-agarwala/" target="_blank" rel="noopener noreferrer" className="contact__social">
                <span className="contact__social-label">LinkedIn</span>
                <span className="contact__social-value">linkedin.com/in/adarsh-agarwala</span>
                <span className="contact__social-arrow">↗</span>
              </a>
              <a href="https://github.com/agarwaladarshcoding-maker" target="_blank" rel="noopener noreferrer" className="contact__social">
                <span className="contact__social-label">GitHub</span>
                <span className="contact__social-value">github.com/adarsh</span>
                <span className="contact__social-arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="contact__right glass-card floating-element ag-interact" style={{ transitionDuration: '0.1s' }}>
            {status === "sent" ? (
              <div className="contact__success">
                <div className="contact__success-check">✓</div>
                <div className="contact__success-title">Message received.</div>
                <div className="contact__success-sub">I'll get back to you.</div>
                <button className="contact__success-back" onClick={function() { setStatus("idle"); }}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                {[
                  { key: "name",    label: "Name",    type: "text",  placeholder: "Your name" },
                  { key: "email",   label: "Email",   type: "email", placeholder: "your@email.com" },
                ].map(function(f) {
                  return (
                    <div className="contact__field" key={f.key}>
                      <label className="contact__label">{f.label}</label>
                      <input
                        className="contact__input"
                        type={f.type}
                        value={form[f.key]}
                        onChange={handleChange(f.key)}
                        placeholder={f.placeholder}
                        required
                      />
                    </div>
                  );
                })}

                <div className="contact__field">
                  <label className="contact__label">Message</label>
                  <textarea
                    className="contact__input contact__textarea"
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="What's on your mind?"
                    rows={5}
                    required
                  />
                </div>

                {status === "error" && (
                  <div className="contact__error">{errMsg || "Something went wrong."}</div>
                )}

                <button type="submit" className="contact__submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message →"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
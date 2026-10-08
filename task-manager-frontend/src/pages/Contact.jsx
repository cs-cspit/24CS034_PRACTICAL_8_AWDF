import React, { useState } from 'react';

/**
 * Contact (Route-based component)
 * Loaded dynamically via React.lazy() only when `/contact` is visited.
 */
export default function Contact({ showNotice }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showNotice?.('Please fill out all required fields', 'error');
      return;
    }

    setSubmitted(true);
    showNotice?.('Message submitted successfully', 'success');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact & University Inquiry</h1>
          <p className="page-description">
            Lazy Route Chunk: <code>Contact.chunk.js</code> &bull; Loaded dynamically via <code>React.lazy()</code>
          </p>
        </div>
      </div>

      <div className="contact-layout-grid">
        {/* Left Column: Form */}
        <div className="card">
          <h2 className="card-title">Send a Message</h2>
          <p className="card-sub">Inquiries, technical feedback, or code review notes</p>

          {submitted ? (
            <div className="contact-success-state">
              <div className="success-icon-bubble">✓</div>
              <h3 className="success-heading">Message Transmitted</h3>
              <p className="success-sub">
                Thank you, <strong>{name}</strong>! Your inquiry regarding &ldquo;{topic}&rdquo; has been recorded.
              </p>
              <button className="btn btn-secondary" onClick={handleReset}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samarth Kalavadia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. 24cs034@charusat.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Topic / Area</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-input"
                >
                  <option value="Feedback">Practical Feedback</option>
                  <option value="Optimization Inquiry">Performance & Lazy Loading</option>
                  <option value="Bug Report">Code Splitting Query</option>
                  <option value="Other">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your note or question here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Transmit Message
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Academic & Technical Reference */}
        <div className="card-stack">
          {/* Student & Course Reference */}
          <div className="card">
            <h3 className="card-title">Academic Details</h3>
            <p className="card-sub">Lab Submission Credentials</p>

            <div className="meta-list">
              <div className="meta-row">
                <span className="meta-key">Student Name:</span>
                <span className="meta-val font-semibold">Samarth Kalavadia</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Student ID:</span>
                <span className="meta-val code-pill">24CS034</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Course:</span>
                <span className="meta-val">ITUE301 &bull; AWDF</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Department:</span>
                <span className="meta-val">CSPIT / DEPSTAR</span>
              </div>
              <div className="meta-row">
                <span className="meta-key">University:</span>
                <span className="meta-val">CHARUSAT</span>
              </div>
            </div>
          </div>

          {/* Code Splitting Verification */}
          <div className="card info-tinted-card">
            <div className="tinted-header">
              <span className="tinted-badge">Optimization Verification</span>
            </div>
            <p className="tinted-body">
              This <strong>Contact</strong> route is code-split from the main bundle. When visiting <code>/</code>, the browser network monitor records zero transfer of <code>Contact.chunk.js</code> until this route is navigated to.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

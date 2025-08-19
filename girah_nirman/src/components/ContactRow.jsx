import React, { useState } from "react";

function ContactRow({ contact, token }) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState(contact.status);
  const [feedback, setFeedback] = useState(contact.userFeedback || "");

  const loadDetails = async () => {
    if (!details) {
      const res = await fetch(`/api/admin/contact/${contact.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDetails(data.contact);
    }
    setDetailsVisible(!detailsVisible);
  };

  const updateStatus = async (newStatus) => {
    setStatus(newStatus);
    await fetch(`/api/admin/contact/${contact.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus, userFeedback: feedback }),
    });
  };

  const updateFeedback = async (e) => {
    const newFeedback = e.target.value;
    setFeedback(newFeedback);
    await fetch(`/api/admin/contact/${contact.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userFeedback: newFeedback }),
    });
  };

  return (
    <div className="contact-row" style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
      <div>
        <strong>{contact.name}</strong>
        <button onClick={loadDetails} style={{ marginLeft: 10 }}>
          {detailsVisible ? "Less Details" : "More Details"}
        </button>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="Pending">Pending</option>
          <option value="Case Closed">Case Closed</option>
          <option value="Not Attended">Not Attended</option>
        </select>
      </div>
      {detailsVisible && details && (
        <div style={{ marginTop: 10 }}>
          <p><strong>Contact Info:</strong> {details.phoneOrEmail}</p>
          <p><strong>Message:</strong> {details.message}</p>
          <textarea
            rows={4}
            style={{ width: "100%", marginTop: 10 }}
            placeholder="User Feedback"
            value={feedback}
            onChange={updateFeedback}
          />
        </div>
      )}
    </div>
  );
}

export default ContactRow;

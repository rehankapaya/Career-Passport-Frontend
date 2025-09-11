import React, { useState } from "react";
import axios from "axios";
import { useContext } from 'react'
import { UserContext } from "../../context/UserContext";

export default function FeedbackForm() {
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const { user } = useContext(UserContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await axios.post(`${apiurl}/api/feedback`, {
        user_id: user._id,
        category,
        message,
      },{
        withCredentials: true
      });

      if (res.data.success) {
        setStatus("success");
        setMessage(""); // clear input
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Submit Feedback</h2>

      <form onSubmit={handleSubmit} className="feedback-form">
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="general">General</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div className="form-group">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* Status messages */}
      {status === "success" && (
        <p className="success-message">âœ… Feedback submitted successfully!</p>
      )}
      {status === "error" && (
        <p className="error-message">âŒ Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
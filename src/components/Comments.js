import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";

function Comments({ productId }) {

  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Kommentare laden
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/comments.php?product_id=${productId}`
      );

      if (!res.ok) throw new Error("HTTP error");

      const responseText = await res.text();

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        throw new Error("Invalid JSON response from server invalid Json");
      }

      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
  if (show) fetchComments();
}, [show, productId]);

  // ➕ Kommentar posten
  const postComment = async () => {

    if (loading) return;
    
    if (!username || !text) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/comments.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_id: productId,
          username,
          comment: text
        })
      });

      const textRes = await res.text();

      let data;
      try {
        data = textRes ? JSON.parse(textRes) : null;
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.error);
      }

      setUsername("");
      setText("");
      fetchComments();

      alert("Comment posted successfully!");
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments">

      <button
        className="comments-toggle-btn"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide comments" : "Show comments"}
      </button>

      {show && (
        <div className="comments-box">

          <h4 className="comments-title">Comments</h4>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="comments-empty">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.username}</strong>
                    <small>
                      {c.created_at && !isNaN(new Date(c.created_at))
                        ? new Date(c.created_at).toLocaleString()
                        : "Unknown date"}
                    </small>
                  </div>
                  <p>{c.comment}</p>
                </div>
              ))
            )}
          </div>

          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="comments-input"
          />

          <textarea
            placeholder="Write your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comments-textarea"
          />

          <button
            onClick={postComment}
            disabled={loading}
            className="comments-submit-btn"
          >
            {loading ? "Posting..." : "Post comment"}
          </button>

        </div>
      )}
    </div>
  );
}

export default Comments;
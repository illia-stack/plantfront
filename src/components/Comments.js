import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function Comments({ productId }) {

  const { language } = useContext(LanguageContext);
  const t = translations[language].comments;

  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments.php?product_id=${productId}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch comments: ${res.status}`);
      }

      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  // Load comments on product change
  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !comment) {
      alert(t.fillFields);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/comments.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, username, comment })
      });

      if (!res.ok) {
        throw new Error(t.fetchError.replace("{status}", res.status));
      }

      const result = await res.json();

      if (!result.success) {
        alert(t.postError.replace("{error}", result.error || ""));
        return;
      }

      setUsername("");
      setComment("");

      // refresh list
      fetchComments();

    } catch (err) {
      console.error("Error posting comment:", err);
    }

    alert(t.postSuccess);
  };

  return (
    <div className="comments">

      <h3>{t.title}</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder={t.name}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder={t.placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" className="primary-btn">{t.post}</button>
      </form>

      {comments.length === 0 ? (
        <p>{t.empty}</p>
      ) : (
        comments.map((c, idx) => (
  <div key={c.id || idx} className="comments">
    <strong>{c.username}</strong>
    <p>{c.comment}</p>
  </div>
))
      )}

    </div>
  );
}

export default Comments;
import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

function Comments({ productId }) {
  const { language } = useContext(LanguageContext);
  const t = translations[language].comments;

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

      if (!res.ok) throw new Error(t.api.httpError);

      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : [];
      } catch {
        throw new Error(t.api.invalidJson);
      }

      setComments(data);
    } catch (err) {
      console.error(t.fetchError.replace("{status}", err.message));
    }
  };

  useEffect(() => {
  if (show) fetchComments();
}, [show, productId]);

  // ➕ Kommentar posten
  const postComment = async () => {
    if (!username || !text) {
      alert(t.fillFields);
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
        throw new Error(t.api.invalidJson);
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || t.api.requestFailed);
      }

      setUsername("");
      setText("");
      fetchComments();

      alert(t.postSuccess);
    } catch (err) {
      alert(t.postError.replace("{error}", err.message));
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
        {show ? t.commentsButtonHide : t.commentsButtonShow}
      </button>

      {show && (
        <div className="comments-box">

          <h4 className="comments-title">{t.title}</h4>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="comments-empty">{t.empty}</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.username}</strong>
                    <small>
                      {new Date(c.created_at).toLocaleString(language)}
                    </small>
                  </div>
                  <p>{c.comment}</p>
                </div>
              ))
            )}
          </div>

          <input
            type="text"
            placeholder={t.name}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="comments-input"
          />

          <textarea
            placeholder={t.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comments-textarea"
          />

          <button
            onClick={postComment}
            disabled={loading}
            className="comments-submit-btn"
          >
            {loading ? "..." : t.post}
          </button>

        </div>
      )}
    </div>
  );
}

export default Comments;
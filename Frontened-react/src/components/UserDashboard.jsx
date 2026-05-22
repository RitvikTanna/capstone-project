import React, { useEffect, useState } from "react";
import {
  articleBody,
  articleCardClass,
  articleExcerpt,
  articleGrid,
  articleMeta,
  articleTitle,
  ghostBtn,
  pageTitleClass,
} from "../styles/common";

import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const [article, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  // logout function
  const onLogout = async () => {
    await logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // fetch articles
  useEffect(() => {
    async function getArticles() {
      try {
        setLoading(true);

        const resObj = await axios.get(
          `${import.meta.env.VITE_API_URL}/user-api/articles`,
          { withCredentials: true }
        );

        console.log("Articles:", resObj.data.payload);

        setArticles(resObj.data.payload);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.error || "Failed to fetch articles"
        );
      } finally {
        setLoading(false);
      }
    }

    getArticles();
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading articles...
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center m-10">
      {/* logout button */}
      <button className={ghostBtn} onClick={onLogout}>
        Logout
      </button>

      {/* title */}
      <div>
        <h1 className={pageTitleClass}>All Articles</h1>
      </div>

      {/* articles */}
      <div className={articleGrid}>
        {article.map((art, idx) => (
          <div
            key={idx}
            className={`${articleCardClass} cursor-pointer`}
            onClick={() => navigate(`/article/${art._id}`)}
          >
            <p className={articleTitle}>{art.title}</p>

            <p className={articleExcerpt}>
              Category: {art.category}
            </p>

            <p className={articleBody}>
              {art.content.length > 150
                ? art.content.substring(0, 150) + "..."
                : art.content}
            </p>

            <p className={articleMeta}>
              Published On:{" "}
              {new Date(art.createdAt).toLocaleDateString()}
            </p>

            {/* read more button */}
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/article/${art._id}`);
              }}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
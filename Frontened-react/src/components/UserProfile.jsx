import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authStore.js/Store';
import axios from 'axios';
import { submitBtn } from '../styles/common';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const user = useAuth(state => state.currentUser);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user-api/articles`,
          { withCredentials: true }
        );

        setArticles(res.data.payload);
      } catch (err) {
        console.log("Error fetching articles:", err);
      }
    };

    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Please Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">



      {/* Header */}
      <div className=" rounded-2xl shadow-sm p-8 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user?.firstName}</span>
          </h1>
          <p className="mt-1 text-gray-500">
            Explore the latest articles.
          </p>
        </div>

        {/* image */}
        <div className='flex justify-center'>
          <img
            src={user?.profileImageUrl}
            alt=""
            className=" flex justify-center w-12 h-12 rounded-full mb-3 "
          />

          <button
            onClick={onLogout}
            className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <div key={article._id} className="border p-5 bg-white rounded-lg">
            <span className="text-blue-500 text-xs uppercase">
              {article.category}
            </span>

            <h3 className="text-xl font-bold mt-1">
              {article.title}
            </h3>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {article.content}
            </p>

            <button
              className={submitBtn + " mt-2"}
              onClick={() => navigate(`/article/${article._id}`, { state: article })}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>

  );
};

export default UserDashboard;
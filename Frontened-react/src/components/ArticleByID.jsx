import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../authStore.js/Store.js";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-api/article/${id}`, { withCredentials: true });

        console.log("Article loaded:", res.data.payload);
        setArticle(res.data.payload);
      } catch (err) {
        const errorMsg = typeof err.response?.data?.error === 'string' ? err.response?.data?.error : err.response?.data?.message || "Failed to load article";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  // Get truncated content for preview
  const getTruncatedContent = (content, limit = 500) => {
    if (!content) return "";
    if (content.length <= limit) return content;
    return content.substring(0, limit) + "...";
  };

  const displayContent = isExpanded ? article.content : getTruncatedContent(article.content, 500);
  const shouldShowReadMore = article.content && article.content.length > 500;

  console.log("Article content length:", article.content?.length);
  console.log("Should show read more:", shouldShowReadMore);
  console.log("Is expanded:", isExpanded);

  //post comment by user
  const addComment = async (commentObj) => {
    if (!commentObj.comment?.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    try {
      commentObj.articleId = article._id;
      commentObj.user = user._id || user.userId;
      console.log("Adding comment:", commentObj);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/user-api/articles`, commentObj, { withCredentials: true });

      if (res.status === 200) {
        console.log("Comment added, updated article:", res.data.payload);
        toast.success(res.data.message || "Comment added successfully");
        setArticle(res.data.payload);
        reset(); // Reset form after successful submission
      }
    } catch (err) {
      console.log("Error adding comment:", err);
      const errorMsg = typeof err.response?.data?.error === 'string'
        ? err.response?.data?.error
        : err.response?.data?.message || "Failed to add comment";
      toast.error(errorMsg);
    } finally {
      setCommentLoading(false);
    }
  };

  // delete comment
  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user-api/articles/${article._id}/comments/${commentId}`, { withCredentials: true });

      if (res.status === 200) {
        toast.success(res.data.message || "Comment deleted successfully");
        setArticle(res.data.payload);
      }
    } catch (err) {
      console.log("Error deleting comment:", err);
      const errorMsg = typeof err.response?.data?.error === 'string'
        ? err.response?.data?.error
        : err.response?.data?.message || "Failed to delete comment";
      toast.error(errorMsg);
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  // Ensure comments is an array
  const comments = article?.comments || [];

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{displayContent}</div>

      {/* Read More / Read Less Button */}
      {shouldShowReadMore && (
        <div className="mt-8 mb-8 w-full flex justify-center z-10 relative">
          <button
            type="button"
            onClick={() => {
              console.log("Button clicked! Toggling expanded...");
              setIsExpanded(!isExpanded);
            }}
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 font-bold rounded-lg transition-all duration-200 cursor-pointer border-2 border-blue-600 hover:border-blue-700 text-base"
          >
            {isExpanded ? "📖 Read Less" : "📖 Read More"}
          </button>
        </div>
      )}

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (article.author?._id === (user?._id || user?.userId) || article.author === (user?._id || user?.userId)) && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}
      {/* form to add comment if role is USER */}
      {/* USER actions */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)} className="w-full">
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Add a Comment</label>
              <textarea
                {...register("comment")}
                className={`${inputClass} w-full h-24 p-3 border border-gray-300 rounded-lg resize-none`}
                placeholder="Share your thoughts on this article..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              disabled={commentLoading}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      )}

      {/* Comments Section - visible to all users */}
      {comments && comments.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments ({comments.length})</h3>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 p-5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-blue-600">
                    {comment.user?.firstName ? `${comment.user.firstName} ${comment.user.lastName || ""}` : comment.user?.email || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {comment.createdAt ? formatDate(comment.createdAt) : ""}
                    </span>
                    {(user?.role === "AUTHOR" || user?._id === comment.user?._id || user?.userId === comment.user?._id || user?.userId === comment.userId || user?.userId === comment.user) && (
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {comments.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;

// {
//   "user":"6989799b7013502767d3f82b",
//   "articleId":"6989750220ce5bf826ec4f7e",
//   "comment":"good article"

// }
import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import EditPostForm from "./EditPostForm";
import PDFViewer from "./PDFViewer";

function PostList({ refreshTrigger, searchQuery = "" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPDF, setViewingPDF] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger, searchQuery]); // searchQuery کو dependency میں شامل کریں

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/posts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { search: searchQuery } // سرچ query کو params میں بھیجیں
      });
      setPosts(data);
      setError("");
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      await API.put(`/posts/${editingPost._id}`, updatedPost, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      toast.success("Post updated successfully!");
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update post");
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleFileClick = (fileUrl, fileType, fileName) => {
    if (fileType?.includes("pdf")) {
      setViewingPDF({ fileUrl, fileName });
    } else {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const closePDFViewer = () => {
    setViewingPDF(null);
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (err) {
        console.error("Error decoding token:", err);
        return null;
      }
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-700 font-medium">{error}</p>
      <button 
        onClick={() => fetchPosts()} 
        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Found {posts.length} document{posts.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingPDF && (
        <PDFViewer
          fileUrl={viewingPDF.fileUrl}
          fileName={viewingPDF.fileName}
          onClose={closePDFViewer}
        />
      )}
      
      {/* Edit Post Form */}
      {editingPost && (
        <EditPostForm
          post={editingPost}
          onUpdate={handleUpdatePost}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery 
              ? 'No documents match your search criteria. Try different keywords.'
              : 'No documents have been published yet. Check back later for updates.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {post.createdBy?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.createdBy?.username}</p>
                        <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only show if current user is the creator */}
                  {post.createdBy?._id === getCurrentUserId() && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Document"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                {post.text && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{post.text}</p>
                  </div>
                )}

                {/* File Attachment */}
                {post.fileUrl && (
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleFileClick(post.fileUrl, post.fileType, post.fileName)}
                      className="flex items-center gap-3 p-3 w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className={`p-2 rounded-lg ${
                        post.fileType?.includes("pdf") 
                          ? "bg-red-100 text-red-600" 
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {post.fileType?.includes("pdf") ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {post.fileName || (post.fileType?.includes("pdf") ? "Document.pdf" : "File")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{post.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                          <span>•</span>
                          <span>Click to {post.fileType?.includes("pdf") ? "view" : "download"}</span>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}

                {/* Edited Indicator */}
                {post.updatedAt !== post.createdAt && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Last edited {formatDate(post.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
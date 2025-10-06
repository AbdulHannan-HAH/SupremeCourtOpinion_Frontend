import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function EditPostForm({ post, onUpdate, onCancel }) {
  const [text, setText] = useState(post.text || "");
  const [file, setFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      
      if (file) {
        formData.append("file", file);
      }
      
      if (removeFile && post.fileUrl) {
        formData.append("removeFile", "true");
      }

      await onUpdate(formData);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4 border-2 border-blue-300">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write something..."
          className="w-full border p-2 mb-3 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />

        {/* Current file info */}
        {post.fileUrl && !removeFile && (
          <div className="mb-3 p-2 bg-gray-100 rounded">
            <p className="text-sm font-medium">Current File:</p>
            <p className="text-sm text-gray-600">{post.fileName}</p>
            <button
              type="button"
              onClick={() => setRemoveFile(true)}
              className="text-red-500 text-sm mt-1 hover:text-red-700"
            >
              Remove File
            </button>
          </div>
        )}

        {/* New file upload */}
        {(!post.fileUrl || removeFile) && (
          <input
            type="file"
            className="mb-3"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        {/* Cancel remove file */}
        {removeFile && (
          <button
            type="button"
            onClick={() => setRemoveFile(false)}
            className="text-blue-500 text-sm mb-3 hover:text-blue-700"
          >
            Keep Current File
          </button>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Post"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPostForm;
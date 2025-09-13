// PickAndSendFile.jsx
import React, { useRef, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { MdClose, MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";

const PickAndSendFile = ({ onFileSent, selectedContact }) => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isFileSending, setIsFileSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");

  const fileRef = useRef(null);

  const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
  // Use passed selectedContact prop instead of Redux state
  const currentUserToConversate = selectedContact;

  const handleFilePicking = (e) => {
    const pickedFile = e?.target?.files[0];
    if (!pickedFile) return;

    setFile(pickedFile);

    if (pickedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(pickedFile);
      setPreviewURL(url);
    } else {
      setPreviewURL(null);
    }
  };

  const sendFileToWhatsapp = async (selectedFile, userWhatsappNumber) => {
    setIsFileSending(true);

    // Remove "+" from phone number if it exists
    const phoneNumberWithoutPlus = userWhatsappNumber?.replace("+", "");

    // Determine media type
    const fileType = selectedFile.type;
    let mediaType = "document";
    
    if (fileType.startsWith("image/")) mediaType = "image";
    else if (fileType.startsWith("video/")) mediaType = "video";

    try {
      console.log(`Starting upload for ${mediaType}:`, selectedFile.name);
      setUploadProgress("Uploading file...");
      
      // First, upload the file to get a URL
      const mediaUrl = await uploadFileToServer(selectedFile);
      
      if (!mediaUrl) {
        throw new Error("Failed to upload file");
      }

      setUploadProgress("Sending message...");
      
      // Send media message using the new API
      const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/messages/send-raw-message-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authInformation?.token, // Using bearer token directly without "Bearer" prefix
        },
        body: JSON.stringify({
          to: phoneNumberWithoutPlus,
          mediaType: mediaType,
          mediaUrl: mediaUrl,
          message: message.trim() || `Sent a ${mediaType}`
        }),
      });

      const result = await apiResponse.json();
      console.log("Media message sent:", result);

      if (apiResponse.ok) {
        // Notify Chats component
        if (typeof onFileSent === "function") {
          onFileSent(mediaType, selectedFile.name, mediaUrl);
        }

        setFile(null);
        setPreviewURL(null);
        setMessage("");
        setUploadProgress("");
      } else {
        throw new Error(result.message || "Failed to send media");
      }
    } catch (error) {
      console.error("Error sending media file:", error?.message);
      
      // Provide more specific error messages
      let errorMessage = "Failed to send file";
      if (error.message.includes("upload")) {
        errorMessage = "Failed to upload file. Please check your internet connection and try again.";
      } else if (error.message.includes("send")) {
        errorMessage = "File uploaded but failed to send message. Please try again.";
      } else {
        errorMessage = `Failed to send file: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsFileSending(false);
      setUploadProgress("");
    }
  };

  // Upload file to server using the /upload-media API
  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name, "Size:", formatFileSize(file.size));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-media`, {
        method: "POST",
        headers: {
          Authorization: authInformation?.token, // Using bearer token directly without "Bearer" prefix
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Upload response:", result);

      if (response.ok && result.fileUrl) {
        console.log("File uploaded successfully:", result.fileUrl);
        return result.fileUrl;
      } else {
        throw new Error(result.message || `Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Re-throw the error so it can be handled by the calling function
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4 text-gray-600 relative">
      {/* File picker */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer p-2 hover:bg-gray-100 transition-all rounded-full"
          disabled={isFileSending}
        >
          <FiPaperclip size={22} />
          <input
            type="file"
            onChange={handleFilePicking}
            className="hidden"
            ref={fileRef}
          />
        </button>
        {/* <MdOutlineEmojiEmotions size={24} className="cursor-pointer" /> */}
      </div>

      {/* File preview modal */}
      {file && (
        <div className="fixed inset-0 bg-black/50 top-15 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-gray-800">File Preview</h3>
              <button 
                onClick={() => {
                  setFile(null);
                  setPreviewURL(null);
                  setUploadProgress("");
                }} 
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                disabled={isFileSending}
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* The file that was just picked to be previewd*/}
            <div className="p-4">
              {previewURL ? (
                <div className="mb-4">
                  <img 
                    src={previewURL}
                    alt="preview" 
                    className="w-full max-h-64 object-contain rounded-lg border bg-gray-50" 
                  />
                </div>
              ) : (
                <div className="mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="font-medium text-gray-700">{file.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              )}

              {/* File information such as "file size" and "file name" */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-700">File Details:</div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>Name: {file.name}</div>
                  <div>Size: {formatFileSize(file.size)}</div>
                  <div>Type: {file.type || 'Unknown'}</div>
                </div>
              </div>

              {/* Message input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a caption to your media..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                  disabled={isFileSending}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {message.length}/1000 characters
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => {
                  setFile(null);
                  setPreviewURL(null);
                  setMessage("");
                  setUploadProgress("");
                }} 
                className="px-4 py-2 text-sm cursor-pointer border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all"
                disabled={isFileSending}
              >
                Cancel
              </button>
              <button 
                onClick={() => sendFileToWhatsapp(file, currentUserToConversate?.phone)} 
                className="px-4 py-2 text-sm cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFileSending}
              >
                {isFileSending ? (uploadProgress || 'Sending...') : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickAndSendFile;
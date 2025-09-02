// PickAndSendFile.jsx
import React, { useRef, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { MdClose, MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";

const PickAndSendFile = ({ onFileSent }) => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isFileSending, setIsFileSending] = useState(false);

  const fileRef = useRef(null);

  const authInformation = useSelector((state) => state?.auth?.authInformation?.at(0));
  const currentUserToConversate = useSelector((state) => state?.selectedContact?.selectedContact);

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

    const formData = new FormData();
    formData.append("to", userWhatsappNumber);
    formData.append("file", selectedFile);

    try {
      const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/whatsapp/media-message`, {
        method: "POST",
        headers: {
          Authorization: authInformation?.token,
        },
        body: formData,
      });

      if (apiResponse.ok) {
        const fileType = selectedFile.type;
        let mediaType = "document";

        if (fileType.startsWith("image/")) mediaType = "image";
        else if (fileType.startsWith("video/")) mediaType = "video";

        // Notify Chats component
        if (typeof onFileSent === "function") {
          onFileSent(mediaType, selectedFile.name);
        }

        setFile(null);
        setPreviewURL(null);
      }
    } catch (error) {
      console.error("Error At Sending File", error?.message);
    } finally {
      setIsFileSending(false);
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
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => {
                  setFile(null);
                  setPreviewURL(null);
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
                {isFileSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickAndSendFile;
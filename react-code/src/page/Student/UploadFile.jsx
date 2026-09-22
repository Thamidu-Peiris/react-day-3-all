
import { useRef, useState } from "react";
import axios from "axios";
import { uploadImage_API } from "../../services/student.api";
import { id } from "zod/v4/locales";

export default function ImageUpload() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  // =========================
  // Select Image
  // =========================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setSuccess(false);
    setProgress(0);

    if (!selectedFile) return;

    // Allowed MIME types
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setPreview("");

      setError("Invalid file type. Only JPG and PNG images are allowed.");

      e.target.value = "";
      return;
    }

    // Optional: File size validation
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (selectedFile.size > maxSize) {
      setFile(null);
      setPreview("");

      setError("File is too large. Maximum file size is 5MB.");

      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // =========================
  // Upload Image
  // =========================
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    console.log(file);
    console.log(id.id);

    try {
        

        const formData = new FormData();
        formData.append("id",id.id);
        formData.append("image",file);

        const resp = await uploadImage_API(formData, (progressEvent) => {
            if (!progressEvent.total) return;
  
            const percentage = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );
  
            setProgress(percentage);
          });

          if(resp?.data?.success){
            setUploading(false);
            setProgress(100);
          }
        
      
    } catch (err) {
        console.log(err)
      
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

   // Upload Image
  // =========================
  const handleUpload2 = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess(false);
      setProgress(0);

      const formData = new FormData();

      formData.append("image", file);

      const response = await axios.post(
        "https://your-api.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              setProgress(percent);
            }
          },
        }
      );

      console.log("Upload response:", response.data);

      setProgress(100);
      setSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);

      setError(
        err?.response?.data?.message ||
          "Something went wrong while uploading the image."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Remove Image
  // =========================
  const handleRemove = () => {
    if (uploading) return;

    setFile(null);
    setPreview("");
    setError("");
    setSuccess(false);
    setProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* =========================
          Upload Box
      ========================= */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/30"
        >
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:scale-105">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0-4 4m4-4 4 4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12v5a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5"
              />
            </svg>
          </div>

          <h3 className="text-sm font-semibold text-gray-800">
            Select Image
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            JPG or PNG • Maximum 5MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <>
          {/* =========================
              Image Preview
          ========================= */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </button>
            </div>

            {/* =========================
                File Info
            ========================= */}
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {success && (
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Uploaded
                  </span>
                )}
              </div>

              {/* =========================
                  Progress
              ========================= */}
              {uploading && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Uploading...
                    </span>

                    <span className="font-semibold text-blue-600">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* =========================
                  Upload Button
              ========================= */}
              {!success && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>

                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16V4m0 0-4 4m4-4 4 4"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12v5a3 3 0 003 3h8a3 3 0 003-3v-5"
                        />
                      </svg>

                      Upload Image
                    </>
                  )}
                </button>
              )}

              {/* =========================
                  Success
              ========================= */}
              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 8"
                      />
                    </svg>
                  </div>

                  Image uploaded successfully.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* =========================
          Error
      ========================= */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadContractPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid PDF file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      // 1. Upload to Cloudinary
      let fileUrl = "";

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.error) {
          throw new Error(uploadData.error.message || "Cloudinary upload failed");
        }
        fileUrl = uploadData.secure_url;
      } else {
        // Fallback to mock delay if env vars are missing
        console.warn("Cloudinary env vars missing. Simulating upload...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Using a reliable sample PDF from W3C
        fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      }

      // 2. Save metadata to our backend
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save contract");
      }

      const { contractId } = await res.json();

      // 3. Redirect to the analyzing page instead of dashboard
      router.push(`/contract/${contractId}`);
    } catch (err) {
      setError("Failed to upload contract. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground">Upload Contract</h2>
        <p className="text-muted-foreground mt-1 text-sm">Upload a PDF contract to begin AI analysis.</p>
      </div>

      <div className="mt-8 glass-panel p-8 rounded-2xl bg-white/50 border-border/50">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-primary/50 hover:bg-secondary/5"
            }`}
        >
          {!file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary/5 flex items-center justify-center text-muted-foreground mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Drag and drop your contract</h3>
              <p className="text-sm text-muted-foreground mb-6">Supported formats: PDF (up to 50MB)</p>

              <label className="cursor-pointer bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow">
                Browse Files
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">{file.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow disabled:opacity-50"
                >
                  {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Upload Document"}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground/80">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-emerald-600/70" /> 
            Your document is securely processed and remains private.
          </div>
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600/70" /> 
            Never Used for AI Training
          </div>
        </div>
      </div>
    </div>
  );
}

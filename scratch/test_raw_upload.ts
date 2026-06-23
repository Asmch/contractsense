import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  // Create a dummy PDF buffer
  const buffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<\n/Title (Dummy)\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF");
  const blob = new Blob([buffer], { type: "application/pdf" });
  
  const formData = new FormData();
  formData.append("file", blob, "dummy.pdf");
  formData.append("upload_preset", uploadPreset!);
  
  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
  });
  
  const uploadData = await uploadRes.json();
  console.log("Upload Data:", uploadData);
  
  if (uploadData.secure_url) {
    const fetchRes = await fetch(uploadData.secure_url);
    console.log("Fetch Status:", fetchRes.status);
  }
}

main().catch(console.error);

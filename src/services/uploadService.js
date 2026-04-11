export const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
  
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
  
    formData.append("upload_preset", "buddybudget_upload");
    formData.append("folder", "profiles");
  
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/tanej/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
  
    const result = await response.json();
    console.log("Cloudinary result:", result);
  
    if (!response.ok) {
      throw new Error(result?.error?.message || "Image upload failed");
    }
  
    return result.secure_url;
  };
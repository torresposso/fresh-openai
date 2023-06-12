import { useState } from "preact/hooks";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState();
  const [uploadImage, setUploadImage] = useState();
  const [uploadMask, setUploadMask] = useState();
  const [variationImageA, setVariationImageA] = useState("");
  const [variationImageB, setVariationImageB] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = new Blob([reader.result], { type: file.type });
      setSelectedImage(imageData);
    };

    reader.readAsArrayBuffer(file);
  };

  // const handleMaskChange = (e) => {
  //   const mask = e.target.files[0];
  //   setSelectedMask(URL.createObjectURL(mask));
  //   setUploadMask(mask);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // const res = await response.json();
      console.log("response", response);
      const res = await response.json();
      console.log("response json", res);
      setVariationImageA(res[0].url);
      setVariationImageB(res[1].url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)} class="flex">
        <div>
          <input
            type="file"
            name="image"
            accept="image/png"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div>
              <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
            </div>
          )}
        </div>

        <button type="submmit">Upload</button>
      </form>

      {variationImageA && (
        <div>
          <p>Uploaded Image:</p>
          <img src={variationImageA} alt="Uploaded" />
        </div>
      )}
      {variationImageB && (
        <div>
          <p>Uploaded Image:</p>
          <img src={variationImageB} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

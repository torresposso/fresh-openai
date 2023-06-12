import { useRef, useState } from "preact/hooks";

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState();
  const [selectedMask, setSelectedMask] = useState();
  const [imageEditA, setImageEditA] = useState();
  const [imageEditB, setImageEditB] = useState();

  const promptRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage || !promptRef) {
      alert("Please select an image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("prompt", String(promptRef));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("response", response);
      const res = await response.json();
      console.log("response json", res);

      setImageEditA(res[0].url);
      setImageEditB(res[1].url);
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

        <div>
          <input
            type="text"
            name="prompt"
            ref={promptRef}
          />
        </div>

        <button type="submmit">Upload</button>
      </form>

      {imageEditA && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageEditA} alt="Uploaded" />
        </div>
      )}
      {imageEditB && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageEditB} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

import "./ImageViewer.css";

const ImageViewer = ({ images, currentIndex, onClose, onChangeImage }) => {
  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onChangeImage(prevIndex);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onChangeImage(nextIndex);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt="Full view"
          className="modal-image"
        />
        {images.length > 1 && (
          <>
            <button className="prev" onClick={prevImage}>
              &#10094;
            </button>
            <button className="next" onClick={nextImage}>
              &#10095;
            </button>
          </>
        )}
        <span className="close" onClick={onClose}>
          &times;
        </span>
      </div>
    </div>
  );
};

export default ImageViewer;

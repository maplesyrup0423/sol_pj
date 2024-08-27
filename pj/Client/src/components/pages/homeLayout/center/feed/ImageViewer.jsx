import "./ImageViewer.css"; // 모달을 위한 CSS

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
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <button className="prev" onClick={prevImage}>
          &#10094;
        </button>
        <img
          src={images[currentIndex]}
          alt="Full View"
          className="modal-image"
        />
        <button className="next" onClick={nextImage}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;

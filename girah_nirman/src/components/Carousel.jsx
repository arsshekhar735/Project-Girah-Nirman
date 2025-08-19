import { useState, useEffect } from "react";

export default function Carousel() {
  const images = [
    "/house1.jpg",
    "/house2.jpg",
    "/house3.jpg",
  ];
  const [index, setIndex] = useState(0);

  const prevSlide = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <img
        src={images[index]}
        alt="project"
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
      >
        {"<"}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
      >
        {">"}
      </button>
    </div>
  );
}

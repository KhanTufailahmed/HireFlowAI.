import { useRef, useEffect } from "react";

const ProximityCard = ({
  children,
  className = "",
  innerClassName = "",
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const isPointerFine = useRef(false);

  useEffect(() => {
    isPointerFine.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  const handleMouseMove = (e) => {
    if (!isPointerFine.current || !containerRef.current || !contentRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    const shiftX = -nx * 3;
    const shiftY = -ny * 3;
    const iconShiftX = -nx * 2;
    const iconShiftY = -ny * 2;

    contentRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
    contentRef.current.style.transition = "transform 120ms ease-out";

    const icon = contentRef.current.querySelector(".proximity-icon");
    if (icon) {
      icon.style.transform = `translate3d(${iconShiftX.toFixed(2)}px, ${iconShiftY.toFixed(2)}px, 0)`;
      icon.style.transition = "transform 140ms ease-out";
    }
  };

  const handleMouseLeave = () => {
    if (!contentRef.current) return;
    contentRef.current.style.transform = "translate3d(0, 0, 0)";
    contentRef.current.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)";

    const icon = contentRef.current.querySelector(".proximity-icon");
    if (icon) {
      icon.style.transform = "translate3d(0, 0, 0)";
      icon.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)";
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
      {...props}
    >
      <div
        ref={contentRef}
        className={`w-full h-full will-change-transform ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ProximityCard;

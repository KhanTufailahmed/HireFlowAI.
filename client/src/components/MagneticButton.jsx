import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const MagneticButton = ({
  children,
  to,
  className = "",
  onClick,
  maxPull = 4,
  ...props
}) => {
  const btnRef = useRef(null);
  const isPointerFine = useRef(false);

  useEffect(() => {
    isPointerFine.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  const handleMouseMove = (e) => {
    if (!isPointerFine.current || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const shiftX = Math.max(-maxPull, Math.min(maxPull, dx * 0.16));
    const shiftY = Math.max(-maxPull, Math.min(maxPull, dy * 0.16));

    btnRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
    btnRef.current.style.transition = "transform 100ms ease-out";
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = "translate3d(0, 0, 0)";
    btnRef.current.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)";
  };

  return (
    <Link
      ref={btnRef}
      to={to}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default MagneticButton;

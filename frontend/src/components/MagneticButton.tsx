"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({ children, className = "" }: Props) {
  return <div className={className}>{children}</div>;
}

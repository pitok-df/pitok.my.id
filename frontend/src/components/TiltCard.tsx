"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = "",
  style = {},
}: Props) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

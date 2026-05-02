type Props = { className?: string };

export default function Logo({ className = "" }: Props) {
  return (
    <span className={`logo ${className}`}>
      trench
      <span className="logo-mark" aria-hidden>
        &apos;
      </span>
      d
    </span>
  );
}

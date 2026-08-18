export default function Avatar({ initials, size = "sm", color }) {
  const colors = [
    "bg-indigo-600",
    "bg-violet-600",
    "bg-fuchsia-600",
    "bg-cyan-700",
    "bg-teal-700",
    "bg-rose-700",
  ];
  const picked = color ?? colors[initials.charCodeAt(0) % colors.length];
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "md"
        ? "w-10 h-10 text-sm"
        : "w-14 h-14 text-base";
  return (
    <div
      className={`${picked} ${sz} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
    >
      {initials}
    </div>
  );
}

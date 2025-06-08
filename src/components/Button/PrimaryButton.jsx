export function PrimaryButton({ text, type, onClick, className, toUppercase = true, fullWidth = true, ...props }) {
  return (
    <button
      className={`h-20 ${fullWidth ? "w-full" : ""} bg-amber-400 text-zinc-100 ${toUppercase ? "uppercase" : ""} ${className ? className : "text-5xl"} rounded-lg hover:opacity-70`}
      onClick={(event) => onClick && onClick(event)}
      type={type}
      {...props}
    >
      {text}
    </button>
  )
}
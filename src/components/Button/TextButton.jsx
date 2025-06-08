export function TextButton({ text, onClick, ...props }) {
  return (
    <button 
      className="bg-transparent border-none uppercase text-2xl h-20 w-full text-zinc-100 hover:opacity-70"
      onClick={(event) => onClick && onClick(event)}
      {...props}
    >
      {text}
    </button>
  )
}
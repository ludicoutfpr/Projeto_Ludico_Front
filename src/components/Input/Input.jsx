export function Input({ description = "", type = "text", value, name, onChange, errorMessage, ...props }) {

  return (
    <div className="flex w-full flex-col">
      <input className={`h-14 bg-amber-50 text-zinc-900 w-full m-0 text-2xl p-2 rounded-lg ${errorMessage ? "border-2 border-red-400" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={description}
        {...props}
      />
      {errorMessage &&
        <span className="text-red-400 font-bold">{errorMessage}</span>
      }
    </div>
  )
}
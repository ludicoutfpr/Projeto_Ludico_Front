export function Label({ description, toUppercase = true, labelWeight }) {
  return (
    <label className={`text-2xl text-zinc-50 w-full m-0 ${toUppercase ? "uppercase" : ""} ${labelWeight ? labelWeight : ""}`} >{description}</label>
  )
}
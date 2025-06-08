import { Input } from "./Input"
import { Label } from "../label"

export function LabeledInput({ description = "", type = "text", name, placeholder, value, onChange, toUppercase = true, labelWeight="font-bold", ...props }) {

  return (
    <div className="flex w-full flex-col gap-1">
      <Label description={description} toUppercase={toUppercase} labelWeight={labelWeight} />
      <Input
        description={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}
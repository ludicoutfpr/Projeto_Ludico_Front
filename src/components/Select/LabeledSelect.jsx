import { Select } from "./Select"
import { Label } from "../label"

export function LabeledSelect({ description = "", options, toUppercase = true, labelWeight = "font-bold", ...props }) {

    return (
        <div className="flex w-full flex-col gap-1">
            <Label description={description} toUppercase={toUppercase} labelWeight={labelWeight} />
            <Select
                options={options}
                {...props}
            />
        </div>
    )
}
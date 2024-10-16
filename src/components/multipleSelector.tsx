import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactElement } from "react";

interface MultipleOptionSelector {
  header: ReactElement;
  fieldName: string;
  choices: string[];
  handleFunction: Function;
  description: ReactElement;
  placeholder: string;
  selectLabel: string;
}

export function MultipleOptionSelector(props: MultipleOptionSelector) {
  return (
    <div className="mt-10 space-y-5">
      <Label htmlFor={props.fieldName} className="font-bold text-lg mt-10">
        {props.header}
      </Label>
      <div className="flex space-x-5">
        <Select
          onValueChange={(value) => {
            props.handleFunction(props.fieldName, value);
            // console.log(value, props.fieldName);
          }}
        >
          <SelectTrigger className="w-96">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{props.selectLabel}</SelectLabel>
              {props.choices.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-[12px] text-neutral-500 self-center">
          {props.description}
        </span>
      </div>
    </div>
  );
}

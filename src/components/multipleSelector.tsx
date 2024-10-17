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
import { ReactElement, useState } from "react";

interface MultipleOptionSelectorProps {
  header: ReactElement;
  fieldName: string;
  choices: { id: number; name: string }[];
  handleFunction: Function | null;
  description: ReactElement;
  placeholder: string;
  selectLabel: string;
}

export function MultipleOptionSelector(props: MultipleOptionSelectorProps) {
  const [value, setValue] = useState("");
  return (
    <div className="mt-10 space-y-5">
      <Label htmlFor={props.fieldName} className="font-bold text-lg mt-10">
        {props.header}
      </Label>
      <div className="flex space-x-5">
        <Select
          value={value}
          onValueChange={(id) => {
            setValue(id);
            const selectedChoice = props.choices.find(
              (choice) => choice.id.toString() === id
            ); 
            if (selectedChoice && props.handleFunction) {
              props.handleFunction(selectedChoice);
            }
          }}
        >
          <SelectTrigger className="w-96">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{props.selectLabel}</SelectLabel>
              {props.choices.map((i) => (
                <SelectItem key={i.id} value={i.id.toString()}>
                  {i.name}
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

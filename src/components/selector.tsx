import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReactElement } from "react";

interface SelectorInterface {
  label: ReactElement;
  name: string;
  choice1: string;
  choice2: string;
  handleFunction: Function;
  value: string;
  description: ReactElement;
}

export function Selector(props: SelectorInterface) {
  return (
    <div className="space-y-5">
      <Label htmlFor={props.name} className="font-bold text-lg">
        {props.label}
      </Label>
      <div className="flex space-x-5">
        <div className="flex space-x-2 w-96">
          <Button
            type="button"
            variant={props.value === props.choice1 ? "default" : "outline"}
            onClick={() => props.handleFunction(props.name, props.choice1)}
            className="w-20 h-12 text-base"
          >
            {props.choice1}
          </Button>
          <Button
            type="button"
            variant={props.value === props.choice2 ? "default" : "outline"}
            onClick={() => props.handleFunction(props.name, props.choice2)}
            className="w-20 h-12 text-base"
          >
            {props.choice2}
          </Button>
        </div>
        <span className="text-[12px] text-neutral-500 self-center">
          {props.description}
        </span>
      </div>
    </div>
  );
}

import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";

interface CustomTooltipProps {
  message: string;
  children: React.ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ message, children }) => {
  return (
    <TooltipProvider delayDuration={0.5}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;

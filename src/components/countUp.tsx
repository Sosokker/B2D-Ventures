"use client";
import CountUp from "react-countup";

interface CountUpComponentProps {
  end: number;
  duration: number;
}

export default function CountUpComponent(props: CountUpComponentProps) {
  return (
    <>
      <CountUp
        end={props.end}
        duration={props.duration}
        start={props.end / 2}
      />
    </>
  );
}

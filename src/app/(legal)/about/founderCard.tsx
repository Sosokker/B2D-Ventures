import Image from "next/image";
interface FounderCardProps {
  image: string;
  name: string;
  position: string;
  background: string;
}

export default function FounderCard(props: FounderCardProps) {
  return (
    <div className="flex flex-col justify-center items-center p-3 border-3">
      <Image src={props.image} alt="profile" width={160} height={160} className="rounded-full w-32" />
      <h1 className="font-bold text-2xl mt-5">{props.name}</h1>
      <p className="text-sm text-neutral-500">{props.position}</p>
      <span className="max-w-xs break-words text-base mt-5 justify-self-center">{props.background}</span>
    </div>
  );
}

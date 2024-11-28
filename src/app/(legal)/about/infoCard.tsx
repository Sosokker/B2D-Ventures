import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type CardProps = {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  content: string[];
  link: string;
  buttonText: string;
};

const InfoCard = ({ imageSrc, imageAlt, heading, content, link, buttonText }: CardProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image alt={imageAlt} width={460} height={460} className="w-36" src={imageSrc} />
      <h1 className="text-2xl font-bold mt-3">{heading}</h1>
      {content.map((text, index) => (
        <p key={index} className={index === 0 ? "mt-3" : ""}>
          {text}
        </p>
      ))}
      <Link href={link}>
        <Button className="p-6 font-semibold text-base mt-5">{buttonText}</Button>
      </Link>
    </div>
  );
};

export default InfoCard;

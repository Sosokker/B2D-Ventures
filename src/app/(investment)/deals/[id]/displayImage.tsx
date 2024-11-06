"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ItemProps {
  src: string | StaticImport;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageModal = ({ src, alt, width, height, className }: ItemProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={src} alt={alt} width={width} height={height} className={className} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription>Click outside to close the image preview.</DialogDescription>
        </DialogHeader>
        <Image src={src} alt={alt} width={700} height={400} />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export function DisplayFullImage({ src, alt, width, height, className }: ItemProps) {
  return <ImageModal src={src} alt={alt} width={width} height={height} className={className} />;
}

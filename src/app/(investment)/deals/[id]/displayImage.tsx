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


const ImageModal = ({ item, width }: { item: { src: string | StaticImport; alt: string;} }, number ) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={item.src} alt={item.alt} width={item.width} height={item.height} className="rounded-lg basis-0" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription>Click outside to close the image preview.</DialogDescription>
        </DialogHeader>
        <Image src={item.src} alt={item.alt} width={700} height={400} />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export function DisplayFullImage({ item }: { item: { src: string | StaticImport; alt: string; width: number; height: number } }) {
  return <ImageModal item={item} />;
}

"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "./ui/carousel";
import Image from "next/image";

interface GalleryProps {
  images: { src: string }[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const syncCarousels = useCallback(
    (index: number) => {
      if (mainApi && thumbnailApi) {
        setCurrent(index);
        mainApi.scrollTo(index);
        thumbnailApi.scrollTo(index);
      }
    },
    [mainApi, thumbnailApi]
  );

  const handleClick = useCallback(
    (index: number) => {
      syncCarousels(index);
    },
    [syncCarousels]
  );

  const mainImage = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-video w-full border-8 border-b">
          <Image
            src={image.src}
            alt={`Carousel Main Image ${index + 1}`}
            fill
            style={{ objectFit: "contain" }}
            priority={index === 0}
          />
        </CarouselItem>
      )),
    [images]
  );

  const thumbnailImages = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem
          key={index}
          className="relative aspect-square basis-1/4 cursor-pointer"
          onClick={() => handleClick(index)}
        >
          <Image
            className={`transition-all duration-200 ${index === current ? "border-2 border-primary" : ""}`}
            src={image.src}
            fill
            alt={`Carousel Thumbnail Image ${index + 1}`}
            style={{ objectFit: "contain" }}
            priority={index === 0}
          />
        </CarouselItem>
      )),
    [images, current, handleClick]
  );

  useEffect(() => {
    if (!mainApi || !thumbnailApi) return;
    if (isReady) return;

    const handleMainSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      if (selected !== current) {
        syncCarousels(selected);
      }
    };

    const handleThumbnailSelect = () => {
      const selected = thumbnailApi.selectedScrollSnap();
      if (selected !== current) {
        syncCarousels(selected);
      }
    };

    mainApi.on("select", handleMainSelect);
    thumbnailApi.on("select", handleThumbnailSelect);

    syncCarousels(0);
    setIsReady(true);

    return () => {
      mainApi.off("select", handleMainSelect);
      thumbnailApi.off("select", handleThumbnailSelect);
    };
  }, [mainApi, thumbnailApi, current, syncCarousels, isReady]);

  return (
    <div className="w-full max-w-xl sm:w-auto">
      <Carousel setApi={setMainApi} className="mb-2">
        <CarouselContent className="m-1">{mainImage}</CarouselContent>
      </Carousel>
      <Carousel setApi={setThumbnailApi} className="cursor-pointer">
        <CarouselContent className="m-1 h-16">{thumbnailImages}</CarouselContent>
      </Carousel>
    </div>
  );
};

export default Gallery;

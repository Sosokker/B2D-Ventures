"use client";
import { useEffect, useState, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "./ui/carousel";
import Image from "next/image";

interface GalleryProps {
  images: { src: string }[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const mainImage = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-video w-full border-8 border-b">
          <Image src={image.src} alt={`Carousel Main Image ${index + 1}`} fill style={{ objectFit: "contain" }} />
        </CarouselItem>
      )),
    [images]
  );

  const thumbnailImages = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="relative aspect-square basis-1/4" onClick={() => handleClick(index)}>
          <Image
            className={`${index === current ? "border-2" : ""}`}
            src={image.src}
            fill
            alt={`Carousel Thumbnail Image ${index + 1}`}
            style={{ objectFit: "contain" }}
          />
        </CarouselItem>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, current]
  );

  useEffect(() => {
    if (!mainApi || !thumbnailApi) {
      return;
    }

    const handleTopSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbnailApi.scrollTo(selected);
    };

    const handleBottomSelect = () => {
      const selected = thumbnailApi.selectedScrollSnap();
      setCurrent(selected);
      mainApi.scrollTo(selected);
    };

    mainApi.on("select", handleTopSelect);
    thumbnailApi.on("select", handleBottomSelect);

    return () => {
      mainApi.off("select", handleTopSelect);
      thumbnailApi.off("select", handleBottomSelect);
    };
  }, [mainApi, thumbnailApi]);

  const handleClick = (index: number) => {
    if (!mainApi || !thumbnailApi) {
      return;
    }
    thumbnailApi.scrollTo(index);
    mainApi.scrollTo(index);
    setCurrent(index);
  };

  return (
    <div className="w-full max-w-xl sm:w-auto">
      <Carousel setApi={setMainApi}>
        <CarouselContent className="m-1">{mainImage}</CarouselContent>
      </Carousel>
      <Carousel setApi={setThumbnailApi}>
        <CarouselContent className="m-1 h-16">{thumbnailImages}</CarouselContent>
      </Carousel>
    </div>
  );
};

export default Gallery;

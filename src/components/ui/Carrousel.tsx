"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Button, ScrollShadow } from "@heroui/react";
import Icon from "@/components/ui/Icon";

interface Props {
  drag?: boolean;
  buttons?: boolean;
  infinity?: boolean;
  defaultItem?: number;
  numberImgs?: boolean;
  fullscreen?: boolean;
  clickeable?: boolean;
  height?: "large" | "standard" | "auto";
  animate?: { show: boolean; time?: number };
  images: { sm: string; md: string; lg: string }[];
  showImages?: { show: boolean; position?: "left" | "right" };
}

const Carrousel = ({
  images: imagesProps,
  animate,
  fullscreen = true,
  buttons = true,
  showImages,
  height = "auto",
  infinity = true,
  numberImgs = true,
  drag = true,
  defaultItem,
  clickeable = true,
}: Props) => {
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const [images, setImages] = useState<
    { sm: string; md: string; lg: string }[] | null
  >(null);
  const [modeFullscreen, setModeFullscreen] = useState<boolean>(false);
  const [selectedImageFullscreen, setSelectedImageFullscreen] =
    useState<number>(0);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [selectedImage, setSelectedImage] = useState(
    defaultItem && defaultItem <= imagesProps.length ? defaultItem - 1 : 0,
  );
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);

  const prevStepFn = (numItem: number) => {
    setDirection("left");
    setSelectedImage(numItem);
    if (modeFullscreen) {
      setSelectedImageFullscreen(numItem);
    }
  };

  const nextStepFn = (numItem: number) => {
    setDirection("right");
    setSelectedImage(numItem);
    if (modeFullscreen) {
      setSelectedImageFullscreen(numItem);
    }
  };

  const handleUpdateImageError = (index: number, value: boolean) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = value;
      return newErrors;
    });
  };

  useEffect(() => {
    if (animate?.show && images) {
      const interval = setInterval(
        () => {
          if (!isInteracting) {
            const nextItem = (selectedImage + 1) % images.length;
            nextStepFn(nextItem);
          }
        },
        animate.time ? animate.time * 1000 : 4000,
      );

      return () => clearInterval(interval);
    }
  }, [selectedImage, images, isInteracting, animate?.show]);

  useEffect(() => {
    if (!images) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModeFullscreen(false);
      }
      if (event.key === "ArrowLeft") {
        prevStepFn(
          selectedImageFullscreen == 0
            ? images.length - 1
            : selectedImageFullscreen - 1,
        );
      }
      if (event.key === "ArrowRight") {
        nextStepFn(
          selectedImageFullscreen == images.length - 1
            ? 0
            : selectedImageFullscreen + 1,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modeFullscreen, selectedImageFullscreen]);

  useEffect(() => {
    if (modeFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modeFullscreen]);

  useEffect(() => {
    if (
      imageErrors.filter((i) => typeof i === "boolean").length ===
      imagesProps.length
    ) {
      const imagesFiltered = imagesProps.filter(
        (e, i) => imageErrors[i] === false,
      );
      setImages(imagesFiltered);
    }
  }, [imagesProps, imageErrors]);

  if (!images) {
    return (
      <>
        {imagesProps.length > 0 &&
          imagesProps.map((img, i) => (
            <div key={i} className="hidden">
              <img
                src={img.sm}
                onError={() => handleUpdateImageError(i, true)}
                onLoad={(e) => handleUpdateImageError(i, false)}
              />
            </div>
          ))}
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {modeFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setModeFullscreen(false);
            }}
            className="fixed flex justify-center items-center top-0 left-0 w-full h-full z-40 bg-custom-black bg-opacity-85"
          >
            <Icon
              icon="x-lg"
              className="absolute top-3 right-3 bg-default flex items-center z-50 justify-center cursor-pointer p-1 w-6 h-6 rounded-large hover:text-primary transition-all"
            />
            <picture
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative overflow-hidden select-none rounded-md flex justify-center items-center mx-auto min-w-[500px] min-h-[500px]",
              )}
            >
              {images.map((item, i) => {
                return (
                  <AnimatePresence key={i} mode="wait">
                    {selectedImageFullscreen === i && (
                      <>
                        <motion.img
                          drag={drag ? "x" : false}
                          dragConstraints={{ right: 0, left: 0 }}
                          onDragStart={() => setIsInteracting(true)}
                          onDragEnd={(event, info) => {
                            setIsInteracting(false);

                            if (info.offset.x > 100) {
                              prevStepFn(
                                selectedImageFullscreen == 0
                                  ? images.length - 1
                                  : selectedImageFullscreen - 1,
                              );
                            } else if (info.offset.x < -100) {
                              nextStepFn(
                                selectedImageFullscreen == images.length - 1
                                  ? 0
                                  : selectedImageFullscreen + 1,
                              );
                            }
                          }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                          initial={{
                            x: direction === "left" ? -2000 : 2000,
                          }}
                          exit={{
                            position: "absolute",
                            x: direction === "left" ? 2000 : -2000,
                          }}
                          src={item.lg}
                          className={cn(
                            "object-cover object-center bg-default w-full h-full",
                          )}
                        />
                      </>
                    )}
                  </AnimatePresence>
                );
              })}
            </picture>
            <div className="fixed bottom-4 flex justify-center items-center gap-4 mx-auto w-[100px]">
              <Button
                isIconOnly
                size="lg"
                color="default"
                onClick={() => {
                  prevStepFn(
                    selectedImageFullscreen == 0
                      ? images.length - 1
                      : selectedImageFullscreen - 1,
                  );
                }}
                className="p-2 rounded-full"
                startContent={
                  <Icon icon="caret-left-fill" className="text-xl" />
                }
              ></Button>
              <Button
                isIconOnly
                size="lg"
                color="default"
                onClick={() => {
                  nextStepFn(
                    selectedImageFullscreen == images.length - 1
                      ? 0
                      : selectedImageFullscreen + 1,
                  );
                }}
                className="p-2 rounded-full"
                startContent={
                  <Icon icon="caret-right-fill" className="text-xl" />
                }
              ></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={cn("flex flex-col-reverse md:flex-row gap-2", {
          "md:flex-row-reverse": showImages && showImages.position == "right",
        })}
      >
        {showImages?.show && (
          <ScrollShadow
            className={cn(
              "flex flex-row md:flex-col min-w-[170px] snap-y max-h-[500px] gap-2",
              {
                "max-h-[400px]": height == "standard",
                "max-h-[1000px]": height == "large",
              },
            )}
          >
            {images.length > 0 &&
              images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.sm}
                    onClick={() => {
                      setSelectedImage(i);
                    }}
                    className={cn(
                      "min-w-[150px] w-[150px] max-h-[100px] h-[100px] min-h-[100px] snap-center rounded-md object-cover transition-all",
                      { "cursor-pointer hover:opacity-hover": clickeable },
                    )}
                  />
                </div>
              ))}
          </ScrollShadow>
        )}
        <section
          className={cn("relative overflow-hidden w-full mx-auto", {
            "h-[400px] max-h-[400px] min-h-[400px]": height == "standard",
            "h-[1000px] max-h-[1000px] min-h-[1000px]": height == "large",
          })}
        >
          <div
            className={cn(
              "p-1 left-0 absolute overflow-visible bottom-3 w-full z-30",
            )}
          >
            <div
              className={cn(
                "flex justify-center w-full mx-auto items-center gap-2",
                { "w-full": images.length > 5 },
              )}
            >
              {images.length > 0 &&
                images.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center font-semibold justify-center select-none transition-all rounded-full opacity-50 hover:opacity-100 bg-divider w-1 h-1 p-2",
                      {
                        "bg-primary text-default-white cursor-pointer":
                          selectedImage === i,
                      },
                      {
                        "text-default-400": i < selectedImage,
                      },
                      {
                        "cursor-pointer hover:text-default-foreground hover:opacity-70 hover:scale-110":
                          clickeable && selectedImage !== i,
                      },
                    )}
                    onClick={() => {
                      if (!clickeable) return;
                      if (
                        (clickeable &&
                          selectedImage !== i &&
                          i == selectedImage + 1) ||
                        i == selectedImage - 1 ||
                        clickeable
                      ) {
                        if (selectedImage < i) {
                          nextStepFn(i);
                        } else {
                          prevStepFn(i);
                        }
                      }
                    }}
                  ></div>
                ))}
            </div>
          </div>

          {/* CHILDRENS */}
          <picture
            className={cn(
              "relative overflow-hidden select-none rounded-md flex justify-center items-center mx-auto w-full min-w-[200px] min-h-[200px] object-cover h-full",
            )}
          >
            {images.length > 0 &&
              images.map((item, i) => (
                <Fragment key={i}>
                  <AnimatePresence mode="wait">
                    {selectedImage === i && (
                      <motion.img
                        drag={drag ? "x" : false}
                        dragConstraints={{ right: 0, left: 0 }}
                        onDragStart={() => setIsInteracting(true)}
                        onDragEnd={(event, info) => {
                          setIsInteracting(false);

                          if (info.offset.x > 100) {
                            if (infinity && selectedImage == 0) {
                              return prevStepFn(images.length - 1);
                            } else if (!infinity && selectedImage < 1) {
                              return;
                            }
                            prevStepFn(i - 1);
                          } else if (info.offset.x < -100) {
                            if (
                              infinity &&
                              selectedImage == images.length - 1
                            ) {
                              return nextStepFn(0);
                            } else if (
                              !infinity &&
                              selectedImage == images.length - 1
                            ) {
                              return;
                            }
                            nextStepFn(i + 1);
                          }
                        }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                        initial={{
                          x: direction === "left" ? -2000 : 2000,
                        }}
                        exit={{
                          position: "absolute",
                          x: direction === "left" ? 2000 : -2000,
                        }}
                        src={item.lg}
                        className={cn(
                          "object-cover object-center bg-default w-full h-full",
                        )}
                      />
                    )}
                  </AnimatePresence>
                </Fragment>
              ))}
            {numberImgs && (
              <div className="bg-background text-default-foreground font-medium absolute top-2 right-2 px-2 rounded-large">
                {selectedImage + 1 + "/" + images.length}
              </div>
            )}
            {fullscreen && (
              <Icon
                icon="arrows-fullscreen"
                className="bg-background text-default-foreground absolute hover:text-primary cursor-pointer z-30 transition-all flex items-center justify-center bottom-2 right-2 p-2 rounded-large"
                onClick={() => {
                  setSelectedImageFullscreen(selectedImage);
                  setModeFullscreen(true);
                }}
              />
            )}
          </picture>

          {/* BUTTONS */}
          {buttons && (
            <div>
              <div className="flex gap-4 mx-auto items-center mt-2 justify-center">
                <Button
                  size="sm"
                  color="default"
                  className={cn("rounded-full w-auto", {
                    "absolute top-[50%] bottom-[50%] self-center items-center justify-center opacity-40 left-3 rounded-full":
                      buttons,
                    hidden: !infinity && selectedImage == 0 && buttons,
                  })}
                  isIconOnly
                  isDisabled={!infinity && selectedImage < 1}
                  onClick={() => {
                    if (infinity && selectedImage == 0) {
                      return prevStepFn(images.length - 1);
                    }
                    prevStepFn(selectedImage - 1);
                  }}
                  startContent={
                    <Icon icon="caret-left-fill" className="text-xl" />
                  }
                />
                <Button
                  size="sm"
                  color="default"
                  className={cn("rounded-full", {
                    "absolute top-[50%] bottom-[50%] self-center items-center justify-center opacity-40 right-3 rounded-full":
                      buttons,
                    hidden:
                      !infinity &&
                      selectedImage == images.length - 1 &&
                      buttons,
                  })}
                  isIconOnly
                  isDisabled={images.length <= selectedImage}
                  onClick={() => {
                    if (infinity && selectedImage == images.length - 1) {
                      return nextStepFn(0);
                    }
                    nextStepFn(selectedImage + 1);
                  }}
                  startContent={
                    <Icon icon="caret-right-fill" className="text-xl" />
                  }
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Carrousel;

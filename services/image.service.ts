import Store from '@/store/Store';
import { Tools } from '@/enums/Tools';
import React from 'react';

let dialogOpened = false;

class ImageService {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  image: HTMLImageElement;
  isSelected: boolean = false;

  setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  constructor(x1: number, y1: number, x2: number, y2: number, image: HTMLImageElement) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.image = image;
  }

  static drawCurrentImage(
    setSelectedTool: React.Dispatch<React.SetStateAction<Tools>>,
    parentRef: React.MutableRefObject<HTMLElement | null>
  ) {
    if (dialogOpened) {
      return;
    }
    dialogOpened = true;

    //open file dialog'
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    // Listen for the change event to get the selected file
    input.addEventListener('change', (event) => {
      setSelectedTool(Tools.Select);
      dialogOpened = false;
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Read the file as a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          // Create a new ImageService instance with the image data
          const imageElement = new Image();
          imageElement.onload = () => {
            let imageWidth = imageElement.width;
            let imageHeight = imageElement.height;
            const parentWidth = parentRef.current?.clientWidth as number;
            const parentHeight = parentRef.current?.clientHeight as number;

            if (imageWidth > parentWidth || imageHeight > parentHeight) {
              const aspectRatio = imageWidth / imageHeight;
              if (imageWidth > imageHeight) {
                imageWidth = parentWidth / 2;
                imageHeight = imageWidth / aspectRatio;
              } else {
                imageHeight = parentHeight / 2;
                imageWidth = imageHeight * aspectRatio;
              }
            }

            const image = new ImageService(
              (parentWidth - imageWidth) / 2,
              (parentHeight - imageHeight) / 2,
              imageWidth,
              imageHeight,
              imageElement
            );

            // Add the image to the Store
            Store.allShapes.push(image);
          };
          imageElement.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });

    input.addEventListener('cancel', () => {
      setSelectedTool(Tools.Select);
      dialogOpened = false;
    });

    input.click();
  }

  static drawStoredImage(ctx: CanvasRenderingContext2D, image: ImageService) {
    if (image.x1 === image.x2 && image.y1 === image.y2) {
      return;
    }

    ctx.drawImage(image.image, image.x1, image.y1, image.x2, image.y2);
  }
}

export default ImageService;

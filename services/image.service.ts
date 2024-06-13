import Store from '@/store/Store';
import { Tools } from '@/enums/Tools';
import React from 'react';
import { Mouse } from '@/app/page';
import SelectionService from '@/services/selection.service';
import ResizeService from '@/services/resize.service';

let dialogOpened = false;

class ImageService {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  image: HTMLImageElement;
  horizontalInverted: boolean = false;
  verticalInverted: boolean = false;
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

    // Save the current context state
    ctx.save();

    // Translate to the center of the image
    ctx.translate(image.x1 + image.x2 / 2, image.y1 + image.y2 / 2);

    // Scale the context to invert the image
    ctx.scale(image.x1 > image.x1 + image.x2 ? -1 : 1, image.y1 > image.y1 + image.y2 ? -1 : 1);

    // Draw the image
    ctx.drawImage(
      image.image,
      -image.x2 / 2, // Adjust the x and y coordinates to account for the translation
      -image.y2 / 2,
      image.x2,
      image.y2
    );

    // Restore the context state to its original state
    ctx.restore();

    if (image.isSelected) {
      SelectionService.drawImageSelectionBox(ctx, image, true);
    }
  }

  static isImageHovered(image: ImageService, mouseRef: React.MutableRefObject<Mouse>) {
    const minX = Math.min(image.x1, image.x1 + image.x2);
    const maxX = Math.max(image.x1, image.x1 + image.x2);
    const minY = Math.min(image.y1, image.y1 + image.y2);
    const maxY = Math.max(image.y1, image.y1 + image.y2);

    return (
      mouseRef.current.x >= minX &&
      mouseRef.current.x <= maxX &&
      mouseRef.current.y >= minY &&
      mouseRef.current.y <= maxY
    );
  }

  static isImageSelectionHovered(image: ImageService, mouseRef: React.MutableRefObject<Mouse>) {
    const tolerance = 5;

    const minX = Math.min(image.x1, image.x1 + image.x2);
    const maxX = Math.max(image.x1, image.x1 + image.x2);
    const minY = Math.min(image.y1, image.y1 + image.y2);
    const maxY = Math.max(image.y1, image.y1 + image.y2);

    return (
      mouseRef.current.x >= minX - tolerance &&
      mouseRef.current.x <= maxX + tolerance &&
      mouseRef.current.y >= minY - tolerance &&
      mouseRef.current.y <= maxY + tolerance
    );
  }

  static getHoveredEdgeOrCorner(image: ImageService, mouseRef: React.MutableRefObject<Mouse>) {
    const points = [
      { x: image.x1, y: image.y1 },
      { x: image.x1 + image.x2, y: image.y1 + image.y2 },
    ];

    image.horizontalInverted = image.x1 > image.x1 + image.x2;
    image.verticalInverted = image.y1 > image.y1 + image.y2;

    return ResizeService.detectRectangleResizeSelection(mouseRef, points);
  }
}

export default ImageService;

import React from 'react';
import { Mouse } from '@/app/page';
import { StrokeColor } from '@/enums/Colors';
import { Fonts } from '@/enums/Fonts';
import Selection from '@/models/Selection';
import Store from '@/store/Store';

class Text {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontColor: StrokeColor;
  fontFamily: string;
  timeStamp: number;
  isSelected: boolean = false;

  setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  constructor(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    fontColor: StrokeColor,
    fontFamily: string,
    timeStamp: number
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.timeStamp = timeStamp;
  }

  static TEXT_DIV_TAG = 'text-input';

  static drawCurrentText(
    mouseRef: React.MutableRefObject<Mouse>,
    parentRef: React.MutableRefObject<HTMLElement | null>,
    selectedFontSize: number,
    selectedFontColor: StrokeColor,
    selectedFontFamily: string,
    timeStamp: number
  ) {
    if (mouseRef.current.down) {
      const inputElement = Text.createInput(
        mouseRef.current.x,
        mouseRef.current.y,
        selectedFontSize,
        selectedFontColor,
        selectedFontFamily,
        parentRef.current?.clientWidth as number,
        parentRef.current?.clientHeight as number,
        timeStamp
      );

      parentRef.current?.appendChild(inputElement);
      inputElement.focus();

      mouseRef.current.down = false;
    }
  }

  static drawStoredText(ctx: CanvasRenderingContext2D, text: Text) {
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.fontColor;

    let verticalOffset = 0;

    switch (text.fontFamily.replace(/['"]+/g, '')) {
      case Fonts.Arial:
        verticalOffset = text.fontSize * 0.41;
        break;
      case Fonts.Verdana:
        verticalOffset = text.fontSize * 0.36;
        break;
      case Fonts.Tahoma:
        verticalOffset = text.fontSize * 0.36;
        break;
      case Fonts.TrebuchetMS:
        verticalOffset = text.fontSize * 0.4;
        break;
      case Fonts.TimesNewRoman:
        verticalOffset = text.fontSize * 0.41;
        break;
      case Fonts.Georgia:
        verticalOffset = text.fontSize * 0.41;
        break;
      case Fonts.Garamond:
        verticalOffset = text.fontSize * 0.45;
        break;
      case Fonts.CourierNew:
        verticalOffset = text.fontSize * 0.48;
        break;
      case Fonts.BrushScriptMT:
        verticalOffset = text.fontSize * 0.48;
        break;
      case Fonts.ComicSansMS:
        verticalOffset = text.fontSize * 0.35;
        break;
    }

    const lines = text.text.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, text.x, text.y + text.fontSize * (index + 1) * 1.5 - verticalOffset);
    });

    if (text.isSelected) {
      Selection.drawTextSelectionBox(ctx, text);
    }
  }

  static isTextHovered(
    text: Text,
    mouseRef: React.MutableRefObject<Mouse>,
    ctx: CanvasRenderingContext2D
  ) {
    const { x, y } = mouseRef.current;
    const lines = text.text.split('\n');

    const minX = text.x;
    const minY = text.y - text.fontSize / 3;
    const maxX = text.x + Math.max(...lines.map((line) => ctx.measureText(line).width));
    const maxY = text.y + text.fontSize * 1.5 * lines.length;

    ctx.font = `${text.fontSize}px ${text.fontFamily}`;

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  //TODO fix input box coords
  static createInput(
    x: number,
    y: number,
    fontSize: number,
    fontColor: StrokeColor,
    fontFamily: string,
    screenWidth: number,
    screenHeight: number,
    timeStamp: number
  ) {
    const inputElement = document.createElement('div');
    inputElement.className = Text.TEXT_DIV_TAG;
    inputElement.contentEditable = 'true';
    inputElement.style.position = 'absolute';
    inputElement.style.top = `${y - fontSize / 1.5}px`;
    inputElement.style.left = `${x}px`;
    inputElement.style.border = 'none';
    inputElement.style.outline = 'none';
    inputElement.style.resize = 'auto';
    inputElement.style.color = fontColor;
    inputElement.style.fontSize = `${fontSize}px`;
    inputElement.style.fontFamily = fontFamily;
    inputElement.style.backgroundColor = 'transparent';
    inputElement.dataset.timeStamp = timeStamp.toString();

    inputElement.oninput = () => {
      //   move the input element to the left if it exceeds the screen width
      const inputWidth = inputElement.clientWidth;
      if (x + inputWidth > screenWidth) {
        inputElement.style.left = `${screenWidth - inputWidth}px`;
      }

      //   move the input element to the top if it exceeds the screen height
      const inputHeight = inputElement.clientHeight;
      if (y + inputHeight > screenHeight) {
        inputElement.style.top = `${screenHeight - inputHeight}px`;
      }
    };

    return inputElement;
  }

  static convertToCanvas(parentDiv: HTMLElement) {
    const allChildren = Array.from(parentDiv.children);

    const inputElements = allChildren.filter((child) => {
      return child.className === Text.TEXT_DIV_TAG;
    });

    //convert input elements to canvas elements
    inputElements.forEach((inputElement) => {
      const input = inputElement as HTMLDivElement;
      const text = new Text(
        parseInt(input.style.left),
        parseInt(input.style.top),
        input.innerText,
        parseInt(input.style.fontSize),
        input.style.color as StrokeColor,
        input.style.fontFamily,
        parseInt(input.dataset.timeStamp!)
      );
      Store.allShapes.push(text);
      parentDiv.removeChild(inputElement);
    });
  }

  static convertToHtml(parentDiv: HTMLElement) {
    //convert canvas elements to input elements
    const texts = Store.allShapes.filter((shape) => shape instanceof Text) as Text[];
    texts.forEach((text) => {
      const input = Text.createInput(
        text.x,
        text.y,
        text.fontSize,
        text.fontColor,
        text.fontFamily,
        parentDiv.clientWidth,
        parentDiv.clientHeight,
        text.timeStamp
      );
      input.innerText = text.text;
      parentDiv.appendChild(input);
    });

    //clear all texts
    Store.allShapes = Store.allShapes.filter((shape) => !(shape instanceof Text));
  }
}

export default Text;

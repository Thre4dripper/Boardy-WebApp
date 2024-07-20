import React from 'react';
import { Mouse } from '@/app/page';
import { StrokeColor } from '@/enums/Colors';
import { Fonts } from '@/enums/Fonts';
import SelectionService from '@/services/selection.service';
import Store from '@/store/Store';
import ResizeService from '@/services/resize.service';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';
import { Theme } from '@/enums/Theme';

class TextModel {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontColor: StrokeColor;
  fontFamily: string;
  stackIndex: number;
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
    stackIndex: number
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.stackIndex = stackIndex;
  }

  static TEXT_DIV_TAG = 'text-input';

  static drawCurrentText(
    mouseRef: React.MutableRefObject<Mouse>,
    parentRef: React.MutableRefObject<HTMLElement | null>,
    selectedFontSize: number,
    selectedFontColor: StrokeColor,
    selectedFontFamily: string,
    stackIndex: number
  ) {
    if (mouseRef.current.down) {
      //get input elements count for stack index
      const inputElements = parentRef.current?.querySelectorAll(`.${TextModel.TEXT_DIV_TAG}`);
      const inputElement = TextModel.createInput(
        mouseRef.current.x,
        mouseRef.current.y,
        selectedFontSize,
        selectedFontColor,
        selectedFontFamily,
        parentRef.current?.clientWidth as number,
        parentRef.current?.clientHeight as number,
        stackIndex + (inputElements?.length || 0)
      );

      parentRef.current?.appendChild(inputElement);
      inputElement.focus();

      mouseRef.current.down = false;
    }
  }

  static drawStoredText(ctx: CanvasRenderingContext2D, text: TextModel) {
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
      SelectionService.drawTextSelectionBox(ctx, text, true);
    }
  }

  static isTextHovered(
    text: TextModel,
    mouseRef: React.MutableRefObject<Mouse>,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    const { x, y } = mouseRef.current;
    const lines = text.text.split('\n');

    const minX = text.x;
    const minY = text.y + text.fontSize / 4;
    const maxX = text.x + Math.max(...lines.map((line) => ctx.measureText(line).width));
    const maxY = text.y + text.fontSize * 1.5 * lines.length - text.fontSize / 6;

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  static getHoveredEdgeOrCorner(
    text: TextModel,
    mouseRef: React.MutableRefObject<Mouse>,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    const lines = text.text.split('\n');

    // const minX = text.x;
    // const minY = text.y + text.fontSize / 4;
    // const maxX = text.x + Math.max(...lines.map((line) => ctx.measureText(line).width));
    // const maxY = text.y + text.fontSize * 1.5 * lines.length - text.fontSize / 6;

    const points = [
      { x: text.x, y: text.y + text.fontSize / 4 },
      {
        x: text.x + Math.max(...lines.map((line) => ctx.measureText(line).width)),
        y: text.y + text.fontSize * 1.5 * lines.length - text.fontSize / 6,
      },
    ];

    return ResizeService.detectRectangleResizeSelection(mouseRef, points);
  }

  static createInput(
    x: number,
    y: number,
    fontSize: number,
    fontColor: StrokeColor,
    fontFamily: string,
    screenWidth: number,
    screenHeight: number,
    stackIndex: number
  ) {
    const inputElement = document.createElement('div');
    inputElement.className = TextModel.TEXT_DIV_TAG;
    inputElement.contentEditable = 'true';
    inputElement.style.position = 'absolute';
    inputElement.style.top = `${y}px`;
    inputElement.style.left = `${x}px`;
    inputElement.style.border = 'none';
    inputElement.style.outline = 'none';
    inputElement.style.resize = 'auto';
    inputElement.style.color = fontColor;
    inputElement.style.fontSize = `${fontSize}px`;
    inputElement.style.fontFamily = fontFamily;
    inputElement.style.backgroundColor = 'transparent';
    inputElement.dataset.stackIndex = stackIndex.toString();

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
      return child.className === TextModel.TEXT_DIV_TAG;
    });

    //convert input elements to canvas elements
    inputElements.forEach((inputElement) => {
      const input = inputElement as HTMLDivElement;
      const text = new TextModel(
        parseInt(input.style.left),
        parseInt(input.style.top),
        input.innerText,
        parseInt(input.style.fontSize),
        input.style.color as StrokeColor,
        input.style.fontFamily,
        parseInt(input.dataset.stackIndex!)
      );

      const stackIndex = parseInt(input.dataset.stackIndex!);
      Store.allShapes.splice(stackIndex, 0, text);
      UndoRedoService.push(
        {
          type: UndoRedoEventType.CREATE,
          index: stackIndex,
          shape: {
            from: null,
            to: text,
          },
        },
        stackIndex
      );
      parentDiv.removeChild(inputElement);
    });
  }

  static convertToHtml(parentDiv: HTMLElement) {
    //convert canvas elements to input elements
    const texts = Store.allShapes.filter((shape) => shape instanceof TextModel) as TextModel[];
    texts.forEach((text) => {
      const input = TextModel.createInput(
        text.x,
        text.y,
        text.fontSize,
        text.fontColor,
        text.fontFamily,
        parentDiv.clientWidth,
        parentDiv.clientHeight,
        text.stackIndex
      );
      input.innerText = text.text;
      parentDiv.appendChild(input);
    });

    //clear all texts
    Store.allShapes = Store.allShapes.filter((shape) => !(shape instanceof TextModel));
    UndoRedoService.removeAllTexts();
  }

  static isAnyTextFocused(parentDiv: HTMLElement) {
    const allChildren = Array.from(parentDiv.children);

    const inputElements = allChildren.filter((child) => {
      return child.className === TextModel.TEXT_DIV_TAG;
    });

    return inputElements.some((inputElement) => {
      return document.activeElement === inputElement;
    });
  }

  static changeHtmlTextTheme(parentDiv: HTMLElement, theme: Theme) {
    // because it catches rgba value to only rgb if it has alpha value 1, so we have do some string manipulation
    const allChildren = Array.from(parentDiv.children);

    const inputElements = allChildren.filter((child) => {
      return child.className === TextModel.TEXT_DIV_TAG;
    });

    inputElements.forEach((inputElement) => {
      const input = inputElement as HTMLDivElement;
      let shade = input.style.color.split(',')[3];
      let baseColor = input.style.color as StrokeColor;
      if (shade === undefined) {
        shade = '1';
        baseColor = baseColor.replace('rgb', 'rgba').replace(')', ',1)') as StrokeColor;
      } else {
        shade = shade.replace(')', '');
      }

      //remove white spaces
      baseColor = baseColor
        .replaceAll(' ', '')
        .substring(0, baseColor.lastIndexOf(',') - 1) as StrokeColor;

      if (StrokeColor.Black.includes(baseColor) || StrokeColor.White.includes(baseColor)) {
        input.style.color =
          theme === Theme.Dark
            ? (StrokeColor.White.replace('1)', shade + ')') as StrokeColor)
            : (StrokeColor.Black.replace('1)', shade + ')') as StrokeColor);
      }
    });
  }
}

export default TextModel;

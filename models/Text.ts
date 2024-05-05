import BaseShape from '@/models/BaseShape';
import { ToolColor, ToolVariant } from '@/enums/Tools';

class Text extends BaseShape {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  static TEXT_DIV_TAG = 'text-input';

  static texts: Text[] = [];

  constructor(id: number, x: number, y: number, text: string, fontSize: number, color: ToolColor) {
    super(0, 0, 0, 0, color, 0, ToolVariant.Solid);
    this.id = id;
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
  }

  static drawTexts(texts: Text[], ctx: CanvasRenderingContext2D) {
    texts.forEach((text) => {
      BaseShape.draw(text, ctx);
      ctx.font = `${text.fontSize}px Arial`;
      ctx.fillStyle = text.strokeColor;
      const lines = text.text.split('\n');
      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          text.x,
          text.y + text.fontSize * (index + 1) * 1.5 - text.fontSize * 0.45
        );
      });
    });
  }

  static createInput(
    x: number,
    y: number,
    fontSize: number,
    color: ToolColor,
    screenWidth: number,
    screenHeight: number
  ) {
    const inputElement = document.createElement('div');
    inputElement.className = Text.TEXT_DIV_TAG;
    inputElement.contentEditable = 'true';
    inputElement.style.position = 'absolute';
    inputElement.style.top = `${y}px`;
    inputElement.style.left = `${x}px`;
    inputElement.style.border = 'none';
    inputElement.style.outline = 'none';
    inputElement.style.resize = 'auto';
    inputElement.style.color = color;
    inputElement.style.fontSize = `${fontSize}px`;
    inputElement.style.fontFamily = 'Arial';
    inputElement.style.backgroundColor = 'transparent';

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
      if (input.innerText === '') {
        parentDiv.removeChild(inputElement);
        return;
      }
      const text = new Text(
        parseInt(input.id),
        parseInt(input.style.left),
        parseInt(input.style.top),
        input.innerText,
        parseInt(input.style.fontSize),
        input.style.color as ToolColor
      );
      Text.texts.push(text);
      parentDiv.removeChild(inputElement);
    });
  }

  static convertToHtml(parentDiv: HTMLElement) {
    //convert canvas elements to input elements
    Text.texts.forEach((text) => {
      const input = Text.createInput(
        text.x,
        text.y,
        text.fontSize,
        text.strokeColor,
        parentDiv.clientWidth,
        parentDiv.clientHeight
      );
      input.id = text.id.toString();
      input.innerText = text.text;
      parentDiv.appendChild(input);
    });

    Text.texts = [];
  }
}

export default Text;
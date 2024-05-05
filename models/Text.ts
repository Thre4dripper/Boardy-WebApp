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
          text.y + text.fontSize * (index + 1) * 1.5 - text.fontSize / 2.5
        );
      });
    });
  }

  static moveBehind(parentDiv: HTMLElement) {
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

  static createInput(x: number, y: number, fontSize: number, color: ToolColor) {
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

    return inputElement;
  }

  static moveToFront(parentDiv: HTMLElement) {
    //convert canvas elements to input elements
    Text.texts.forEach((text) => {
      const input = Text.createInput(text.x, text.y, text.fontSize, text.strokeColor);
      input.id = text.id.toString();
      input.innerText = text.text;
      parentDiv.appendChild(input);
    });

    Text.texts = [];
  }
}

export default Text;

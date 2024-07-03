import { StrokeVariant } from '@/enums/StrokeVariant';

interface CardProps {
  selectedTool: string;
  selectedShapeType: string | null;
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeVariant: StrokeVariant;
  setSelectedStrokeVariant: (variant: StrokeVariant) => void;
  selectedFillColor: string;
  setSelectedFillColor: (color: string) => void;
  selectedShapeSides: number;
  setSelectedShapeSides: (sides: number) => void;
  selectedShapeRotation: number;
  setSelectedShapeRotation: (rotation: number) => void;
  selectedLeftArrowHead: string;
  setSelectedLeftArrowHead: (arrowHead: string) => void;
  selectedRightArrowHead: string;
  setSelectedRightArrowHead: (arrowHead: string) => void;
  selectedFontSize: number;
  setSelectedFontSize: (size: number) => void;
  selectedFontFamily: string;
  setSelectedFontFamily: (font: string) => void;
}

export interface PropertiesCardProps extends CardProps {}

export interface ToolBasedCardProps extends Omit<CardProps, 'selectedShapeType'> {}

export interface ShapeBasedCardProps extends Omit<CardProps, 'selectedTool'> {}

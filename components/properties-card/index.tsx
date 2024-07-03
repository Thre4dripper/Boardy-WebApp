import ToolBasedCard from '@/components/properties-card/tool-based-card';
import { PropertiesCardProps } from '@/components/properties-card/interface';
import { Tools } from '@/enums/Tools';
import ShapeBasedCard from '@/components/properties-card/shape-based-card';

export type ColorControl = 'stroke' | 'fill' | 'text';
export default function PropertiesCard({
  selectedTool,
  selectedShapeType,
  ...rest
}: PropertiesCardProps) {
  return (
    <>
      {selectedTool !== Tools.Select ? (
        <ToolBasedCard selectedTool={selectedTool} {...rest} />
      ) : (
        <ShapeBasedCard selectedShapeType={selectedShapeType} {...rest} />
      )}
    </>
  );
}

import { intensToY } from "@/utils/draw-utils";

interface ScaleProps {
  height: number;
}

function Scale(props: ScaleProps) {
  const {height} = props;
  return (
    <div style={{marginRight: '10px'}}>
    <svg width={16} height={height}>
      <text x={16} y={intensToY(100, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>1</text>
      <text x={16} y={intensToY(80, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>0.8</text>
      <text x={16} y={intensToY(60, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>0.6</text>
      <text x={16} y={intensToY(40, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>0.4</text>
      <text x={16} y={intensToY(20, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>0.2</text>
    </svg>
    </div>
  )
}

export default Scale;
import { intensToY } from "@/utils/draw-utils";

interface ScaleProps {
  height: number;
}

function Scale(props: ScaleProps) {
  const {height} = props;
  return (
    <div style={{userSelect: 'none', pointerEvents: 'none'}}>
    <svg width={16} height={height}>
      <text x={16} y={intensToY(100, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>100</text>
      <text x={16} y={intensToY(80, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>80</text>
      <text x={16} y={intensToY(60, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>60</text>
      <text x={16} y={intensToY(40, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>40</text>
      <text x={16} y={intensToY(20, height, 32)} fill='white' dominantBaseline='hanging' textAnchor='end' fontSize={8}>20</text>
    </svg>
    </div>
  )
}

export default Scale;
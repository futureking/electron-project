import store from "@/stores";
import { observer } from "mobx-react-lite";

interface FocusProps {
    x: number;
    y: number;
    w: number;
    h: number;
}

const IndicatorY = observer((props: FocusProps) => {
    const { x, y, w } = props;
    const width = w > 16 ? 16 : w;
    return (
        <g >
            <rect x={x} y={y - 16} width={w} height={16} fillOpacity={0} onMouseDown={(event: React.MouseEvent) => {
                // console.log('down', event.clientY, event.nativeEvent.offsetY, event.nativeEvent.offsetX - x, y - event.nativeEvent.offsetY );
                store.selection.setOP('Intensity', event.nativeEvent.offsetX - x, y - event.nativeEvent.offsetY);
            }} />
            <line x1={x + w / 2 - width / 2} y1={y - 11} x2={x + w / 2 + width / 2} y2={y - 11} stroke='#36cfc9' />
            <line x1={x + w / 2 - width / 2} y1={y - 5} x2={x + w / 2 + width / 2} y2={y - 5} stroke='#36cfc9' />
        </g>
    );
});

const IndicatorX = observer((props: FocusProps) => {
    const { x, y, w, h } = props;
    const height = h > 16 ? 16 : h;
    return (
        <g >
            <rect x={x + w} y={y} width={16} height={h} fillOpacity={0} onMouseDown={(event) => {
                // console.log('down', event.clientX, event.nativeEvent.offsetX, event.nativeEvent.offsetX - x, y - event.nativeEvent.offsetY );
                store.selection.setOP('Duration', event.nativeEvent.offsetX - x - w, event.nativeEvent.offsetY);
            }} />
            <line x1={x + w + 5} y1={y + h / 2 - height / 2} x2={x + w + 5} y2={y + h / 2 + height / 2} stroke='#36cfc9' />
            <line x1={x + w + 11} y1={y + h / 2 - height / 2} x2={x + w + 11} y2={y + h / 2 + height / 2} stroke='#36cfc9' />
        </g>
    );
});


export { IndicatorX, IndicatorY };
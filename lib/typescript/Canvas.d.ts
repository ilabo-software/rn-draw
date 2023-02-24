import React from 'react';
import { CanvasRef, CanvasProps as CoreCanvasProps } from './core';
export interface CanvasProps extends CoreCanvasProps {
    /**
     * When set to true the view will display information about the
     * average time it takes to render.
     * @default false
     */
    debug?: boolean;
    /**
     * Background color of the canvas
     * @default DEFAULT_CANVAS_BACKGROUND_COLOR
     */
    backgroundColor?: string;
}
declare const Canvas: React.ForwardRefExoticComponent<CanvasProps & React.RefAttributes<CanvasRef>>;
export default Canvas;
//# sourceMappingURL=Canvas.d.ts.map
export interface WhiteboardElement {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    strokeColor: string;
    backgroundColor: string;
    fillStyle: string;
    strokeWidth: number;
    strokeStyle: string;
    roughness: number;
    opacity: number;
    groupIds: string[];
    frameId: string | null;
    roundness: { type: number; value?: number } | null;
    seed: number;
    version: number;
    versionNonce: number;
    isDeleted: boolean;
    boundElements: { id: string; type: string }[] | null;
    updated: number;
    link: string | null;
    locked: boolean;
}

export interface WhiteboardAppState {
    viewBackgroundColor?: string;
    currentItemFontFamily?: number;
    currentItemFontSize?: number;
    currentItemFontWeight?: number;
    currentItemStrokeColor?: string;
    currentItemBackgroundColor?: string;
    currentItemFillStyle?: string;
    currentItemStrokeWidth?: number;
    currentItemStrokeStyle?: string;
    currentItemRoughness?: number;
    currentItemOpacity?: number;
    gridModeEnabled?: boolean; // Add this missing prop
    gridSize?: number | null;
    scrollX?: number;
    scrollY?: number;
    zoom?: { value: number };
    theme?: string;
    [key: string]: any; // Allow extensibility for other Excalidraw props
}

export interface WhiteboardData {
    elements: WhiteboardElement[];
    appState: WhiteboardAppState;
    scrollToContent?: boolean;
}

export interface WhiteboardSnapshot {
    elements: WhiteboardElement[];
    appState: Partial<WhiteboardAppState>;
}

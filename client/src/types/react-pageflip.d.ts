declare module 'react-pageflip' {
    export interface PageFlipProps {
        width: number;
        height: number;
        size?: 'fixed' | 'stretch';
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        drawShadow?: boolean;
        flippingTime?: number;
        usePortrait?: boolean;
        startZIndex?: number;
        autoSize?: boolean;
        maxShadowOpacity?: number;
        showCover?: boolean;
        mobileScrollSupport?: boolean;
        clickEventForward?: boolean;
        useMouseEvents?: boolean;
        swipeDistance?: number;
        showPageCorners?: boolean;
        disableFlipByClick?: boolean;
        onFlip?: (e: { data: number }) => void;
        onChangeOrientation?: (e: { data: string }) => void;
        onChangeState?: (e: { data: string }) => void;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
        ref?: React.Ref<any>;
    }
    const HTMLFlipBook: React.ForwardRefExoticComponent<PageFlipProps & React.RefAttributes<any>>;
    export default HTMLFlipBook;
}

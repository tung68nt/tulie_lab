export default function Loading() {
    // We return null because TopProgressBar (in layout.tsx) handles the visual indicator.
    // The presence of this file tells Next.js to use partial rendering/transitions
    // immediately upon navigation.
    return null;
}

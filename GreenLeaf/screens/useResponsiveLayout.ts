import { useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
    const { width, height } = useWindowDimensions();
    const compact = width < 360 || height < 700;

    return {
        compact,
        width,
        height,
    };
}

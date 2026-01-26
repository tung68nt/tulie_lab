import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
    name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
    // Cast strict string to keyof typeof icons type check
    // Alias 'Layout' to 'LayoutDashboard' if not found, to satisfy user request
    const iconName = name === 'Layout' ? 'LayoutDashboard' : name;

    // @ts-ignore - Dynamic access
    const Icon = icons[iconName];

    if (!Icon) {
        return null;
    }

    return <Icon {...props} />;
};

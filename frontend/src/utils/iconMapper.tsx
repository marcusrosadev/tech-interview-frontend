import React from 'react';
import {
  BriefcaseIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
} from '@heroicons/react/24/solid';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>> = {
  BriefcaseIcon: BriefcaseIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  RocketLaunchIcon: RocketLaunchIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  ChatBubbleLeftRightIcon: ChatBubbleLeftRightIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  CpuChipIcon: CpuChipIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
};

export function getIconComponent(
  iconName?: string,
  className: string = 'w-6 h-6'
): React.ReactElement | null {
  if (!iconName) {
    return null;
  }

  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Ícone "${iconName}" não encontrado no mapeamento`);
    return null;
  }

  return <IconComponent className={className} />;
}


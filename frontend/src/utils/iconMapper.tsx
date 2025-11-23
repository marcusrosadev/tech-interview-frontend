import React from 'react';
import {
  BriefcaseIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
} from '@heroicons/react/24/solid';

/**
 * Mapeamento de nomes de ícones para componentes do Heroicons
 * Usando ícones solid para melhor visibilidade e destaque
 */
const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>> = {
  BriefcaseIcon: BriefcaseIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  RocketLaunchIcon: RocketLaunchIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  ChatBubbleLeftRightIcon: ChatBubbleLeftRightIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
  CpuChipIcon: CpuChipIcon as React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>,
};

/**
 * Retorna o componente de ícone correspondente ao nome fornecido
 * @param iconName - Nome do ícone (ex: "UserGroupIcon")
 * @param className - Classes CSS opcionais para o ícone
 * @returns Componente de ícone ou null se não encontrado
 */
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


import React from 'react';
import { Flame, Sparkles, Leaf, Crown, Zap } from 'lucide-react';
import { BadgeDesignId } from '../types';
import { BADGE_OPTIONS } from '../data/badges';

interface ProductBadgeProps {
  badgeId: BadgeDesignId;
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  badgeId,
  customText,
  size = 'sm',
  className = '',
}) => {
  const badgeConfig = BADGE_OPTIONS.find((b) => b.id === badgeId) || BADGE_OPTIONS[0];
  const text = customText || badgeConfig.labelDefault;

  const renderIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    switch (badgeConfig.id) {
      case 1:
        return <Flame className={`${iconSize} ${badgeConfig.iconClass}`} />;
      case 2:
        return <Sparkles className={`${iconSize} ${badgeConfig.iconClass}`} />;
      case 3:
        return <Leaf className={`${iconSize} ${badgeConfig.iconClass}`} />;
      case 4:
        return <Crown className={`${iconSize} ${badgeConfig.iconClass}`} />;
      case 5:
        return <Zap className={`${iconSize} ${badgeConfig.iconClass}`} />;
      default:
        return <Flame className={`${iconSize} ${badgeConfig.iconClass}`} />;
    }
  };

  const paddingClass = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wider uppercase transition-all backdrop-blur-md ${badgeConfig.containerClass} ${paddingClass} ${className}`}
    >
      {renderIcon()}
      <span className={badgeConfig.textClass}>{text}</span>
    </span>
  );
};

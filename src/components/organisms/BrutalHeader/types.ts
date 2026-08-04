import React from 'react';

export interface BrutalHeaderProps {
  title: string;
  showBack?: boolean;
  backRoute?: boolean;
  transparent?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  onBack?: () => void;
}

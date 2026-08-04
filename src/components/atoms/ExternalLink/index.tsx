import { playClickSound } from '@/services/soundManager';
import { Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import React from 'react';
import { ExternalLinkProps } from './types';

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, ...rest }) => {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        playClickSound();
        if (process.env.EXPO_OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
};

export default ExternalLink;

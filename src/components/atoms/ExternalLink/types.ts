import { Href, Link } from 'expo-router';
import React from 'react';

export type ExternalLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & { href: Href & string };

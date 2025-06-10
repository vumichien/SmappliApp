// Platform-agnostic clipboard utility
// This file will automatically resolve to .web.ts or .native.ts based on platform

export { copyToClipboard, getFromClipboard } from './clipboard.native';


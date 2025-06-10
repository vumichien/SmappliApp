// Web API type definitions for React Native Web
declare global {
  interface Navigator {
    clipboard?: {
      writeText(text: string): Promise<void>;
      readText(): Promise<string>;
    };
  }

  interface Window {
    isSecureContext?: boolean;
  }

  interface Document {
    execCommand(command: string): boolean;
    createElement(tagName: string): HTMLElement;
  }

  interface HTMLInputElement {
    type: string;
    accept: string;
    files: FileList | null;
    onchange: ((event: Event) => void) | null;
    oncancel: (() => void) | null;
    click(): void;
  }

  interface FileReader {
    onload: ((event: ProgressEvent<FileReader>) => void) | null;
    onerror: ((event: ProgressEvent<FileReader>) => void) | null;
    result: string | ArrayBuffer | null;
    readAsText(file: File): void;
  }

  interface FileList {
    [index: number]: File;
    length: number;
  }

  interface File {
    name: string;
    size: number;
    type: string;
  }

  var FileReader: {
    prototype: FileReader;
    new(): FileReader;
  };
} 
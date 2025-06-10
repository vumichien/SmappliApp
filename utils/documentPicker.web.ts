// Web implementation for document picker
export const pickDocument = async (): Promise<{ content: string } | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt,application/json,text/plain';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve({ content });
        };
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    };
    
    input.oncancel = () => resolve(null);
    input.click();
  });
}; 
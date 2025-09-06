// Example: parse secrets output utility
export function parseSecretsOutput(output: string) {
  try {
    const parsed = JSON.parse(output);
    if (parsed && parsed.results) {
      const secrets: Array<{ filename: string; type: string; line_number: number; hashed_secret: string }> = [];
      Object.entries(parsed.results).forEach(([filename, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            secrets.push({
              filename,
              type: item.type,
              line_number: item.line_number,
              hashed_secret: item.hashed_secret
            });
          });
        }
      });
      return secrets;
    }
  } catch {
    return [];
  }
  return [];
}

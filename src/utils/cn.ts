type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Concatena classes condicionais sem dependências externas. */
export function cn(...values: ClassValue[]): string {
  const output: string[] = [];

  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) output.push(nested);
    } else {
      output.push(String(value));
    }
  }

  return output.join(' ');
}

export function findMostRepeatedConsecutiveCharacters(input: string[]): string[] {
    if (input.length < 2) return [];

    let currentChar = input[0];
    let currentCount = 1;
    let maxCount = 1;
    const maxChars = new Set<string>();

    for (let i = 1; i < input.length; i++) {
        if (input[i] === currentChar) {
            currentCount++;
            
            if (currentCount > maxCount) {
                maxCount = currentCount;
                maxChars.clear();
                maxChars.add(currentChar);
            } 
            else if (currentCount === maxCount && maxCount > 1) {
                maxChars.add(currentChar);
            }
        } else {
            currentChar = input[i];
            currentCount = 1;
        }
    }

    return maxCount > 1 ? Array.from(maxChars).sort() : [];
}

export function parseInputFile(fileContent: string): string[][] {
    return fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Remove brackets and split by comma
            const cleaned = line.replace(/[[\]]/g, '').trim();
            return cleaned.split(',').map(char => char.trim());
        });
} 
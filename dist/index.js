"use strict";
function findMostRepeatedConsecutiveCharacters(input) {
    if (input.length < 2)
        return [];
    // Keep track of current sequence and max sequence length
    let currentChar = input[0];
    let currentCount = 1;
    let maxCount = 1;
    const maxChars = new Set();
    // Process each character
    for (let i = 1; i < input.length; i++) {
        if (input[i] === currentChar) {
            // Increment current sequence count
            currentCount++;
            // If we found a longer sequence, clear previous results
            if (currentCount > maxCount) {
                maxCount = currentCount;
                maxChars.clear();
                maxChars.add(currentChar);
            }
            // If we found an equal length sequence, add to results
            else if (currentCount === maxCount && maxCount > 1) {
                maxChars.add(currentChar);
            }
        }
        else {
            // Reset count for new character
            currentChar = input[i];
            currentCount = 1;
        }
    }
    // Only return results if we found sequences of length > 1
    return maxCount > 1 ? Array.from(maxChars).sort() : [];
}
// Test cases
const testCases = [
    ['a'],
    ['a', 'a'],
    ['a', 'b'],
    ['a', 'a', 'b', 'b'],
    ['a', 'b', 'b', 'a'],
    ['a', 'a', 'z', 'z', 'z', 'a', 'a'],
    ['r', 'r', 'r', 'a', 'a', 'g', 'g', 'g', 'r', 'r', 'r'],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    ['a', 'a', 'b', 'b', 'b', 'a', 'a', 'a', 'b', 'c', 'c', 'c'],
    ['a', 'a', 'a', 'b', 'b', 'b', 'a', 'a', 'a', 'b', 'c', 'c', 'c'],
    ['a', 'a', 'a', 'b', 'b', 'b', 'a', 'a', 'b', 'c', 'c', 'c'],
];
testCases.forEach(test => {
    console.log(`Input: [${test.join(',')}]`);
    console.log(`Output: [${findMostRepeatedConsecutiveCharacters(test).join(',')}]`);
    console.log('---');
});
//# sourceMappingURL=index.js.map
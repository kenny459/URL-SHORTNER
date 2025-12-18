const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = characters.length; // 62

/**
 * Encodes a database integer ID into a short string.
 * Example: 1000 -> "g8"
 */
export const encodeId = (id) => {
  if (id === 0) return characters[0];
  
  let encoded = '';
  let currentId = id;

  while (currentId > 0) {
    // 1. Find the remainder (modulo)
    const remainder = currentId % base;
    
    // 2. Map remainder to a character
    encoded = characters[remainder] + encoded;
    
    // 3. Divide by base to move to next digit
    currentId = Math.floor(currentId / base);
  }

  return encoded;
};

/**
 * Decodes a short string back into a database integer ID.
 * Example: "g8" -> 1000
 * (Useful if you want to lookup by ID instead of string column)
 */
export const decodeId = (shortCode) => {
  let id = 0;
  
  for (let i = 0; i < shortCode.length; i++) {
    const char = shortCode[i];
    const value = characters.indexOf(char);
    id = id * base + value;
  }
  
  return id;
};
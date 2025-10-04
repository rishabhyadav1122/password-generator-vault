import { PasswordGeneratorOptions } from '@/types';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const LOOK_ALIKES = '0O1lI'; // Characters that look similar and might be confusing

export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';
  
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  
  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }
  
  // Remove look-alike characters if requested
  if (options.excludeLookAlikes) {
    charset = charset.split('').filter(char => !LOOK_ALIKES.includes(char)).join('');
  }
  
  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

export const defaultPasswordOptions: PasswordGeneratorOptions = {
  length: 16,
  includeNumbers: true,
  includeSymbols: true,
  includeUppercase: true,
  includeLowercase: true,
  excludeLookAlikes: false,
};

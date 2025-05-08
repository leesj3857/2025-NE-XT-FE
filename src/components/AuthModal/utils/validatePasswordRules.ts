const commonPasswords = [
    '12345678',
    'password',
    '11111111',
    '123456789',
    '12345678',
  ];
  
  const isAllSameChar = (str: string): boolean => {
    return str.length > 0 && str.split('').every((char) => char === str[0]);
  };
  
  export const validatePasswordRules = (
    password: string,
    email: string = ''
  ) => {
    const trimmed = password.trim().toLowerCase();
    const normalizedEmail = email.toLowerCase();
  
    const isCommon =
      commonPasswords.includes(trimmed) || isAllSameChar(trimmed);
  
    return {
      length: trimmed.length >= 8,
      notOnlyNumbers: !/^\d+$/.test(trimmed),
      notCommon: !isCommon,
      notSimilarToEmail: !normalizedEmail || !trimmed.includes(normalizedEmail.split('@')[0]),
    };
  };
  
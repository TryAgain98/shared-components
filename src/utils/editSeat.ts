export const generateSequentialLabels = (
  startValue: string,
  length: number,
): string[] => {
  const isNumeric = !isNaN(Number(startValue));
  const labels: string[] = [];

  if (isNumeric) {
    const startNum = parseInt(startValue);
    for (let i = 0; i < length; i++) {
      labels.push(String(startNum + i));
    }
  } else {
    const isUpperCase = startValue === startValue.toUpperCase();
    const baseCharCode = isUpperCase ? 65 : 97; // 'A' = 65, 'a' = 97

    const toIndex = (char: string): number => {
      return char.charCodeAt(0) - baseCharCode;
    };

    const toLabel = (index: number): string => {
      if (index < 26) {
        return String.fromCharCode(baseCharCode + index);
      } else {
        const repeatedChar = String.fromCharCode(baseCharCode + (index % 26));
        return repeatedChar.repeat(2); // "aa", "bb", "cc", ...
      }
    };

    const startIndex = toIndex(startValue);
    for (let i = 0; i < length; i++) {
      labels.push(toLabel(startIndex + i));
    }
  }

  return labels;
};

export const changeSeatStartAt = (value: string) => {
  {
    let validValue = '';

    // If first character is uppercase
    if (/^[A-Z]/.test(value)) {
      const firstChar = value[0];
      validValue = firstChar.repeat(value.length);
    }
    // If first character is lowercase
    else if (/^[a-z]/.test(value)) {
      const firstChar = value[0];
      validValue = firstChar.repeat(value.length);
    }
    // If first character is number, only allow numbers from 1-9
    else if (/^[1-9]/.test(value)) {
      validValue = value.replace(/[^1-9]/g, '');
    }
    // If empty string, allow both letters and numbers
    else {
      validValue = value.replace(/[^1-9a-zA-Z]/g, '');
    }

    return validValue;
  }
};

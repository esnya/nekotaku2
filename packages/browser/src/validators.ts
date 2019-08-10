/* eslint @typescript-eslint/no-explicit-any: off */

export type Validator = (value: any) => boolean | string;

export function required(value: any): boolean | string {
  return value ? true : '入力してください';
}

function validateString(
  value: any,
  validator: (value: string) => boolean | string,
): boolean | string {
  if (typeof value !== 'string') return '文字を入力してください';
  return validator(value);
}

export function maxLength(n: number): Validator {
  return value => {
    return validateString(value, str => {
      if (str.length > n) return `${n}文字以下で入力してください`;
      return true;
    });
  };
}

export function minLength(n: number): Validator {
  return value => {
    return validateString(value, str => {
      if (str.length < n) return `${n}文字以上入力してください`;
      return true;
    });
  };
}

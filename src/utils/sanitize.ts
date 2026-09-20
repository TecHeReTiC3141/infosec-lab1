import validator from "validator";

export const sanitizeText = (value: string): string => {
  return validator.escape(value);
};

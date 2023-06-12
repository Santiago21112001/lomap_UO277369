import * as DOMPurify from "dompurify";

/**
 * Comprueba que un campo no está vacío.
 * @param value
 */
function checkIsNotEmpty (value: string) {
  const sValue = sanitizeInput(value);
  if (!sValue || sValue.length === 0) {
    throw new Error("Campo vacío");
  }
};

function sanitizeInput(value: string) {
  return DOMPurify.sanitize(value);
};

export { checkIsNotEmpty };


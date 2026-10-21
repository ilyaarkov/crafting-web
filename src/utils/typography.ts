// Короткие предлоги, союзы и частицы, которые не должны оставаться в конце строки
const SHORT_WORDS = [
  'в', 'во', 'без', 'до', 'из', 'к', 'ко', 'на', 'над', 'о', 'об', 'от', 'по', 'под', 'при', 'про',
  'с', 'со', 'у', 'и', 'а', 'но', 'да', 'для', 'не', 'ни', 'за', 'или', 'её', 'его', 'их',
  'a', 'an', 'the', 'of', 'in', 'on', 'to', 'at', 'by', 'for', 'and', 'or', 'with', 'her', 'his',
];

const GLUE_RE = new RegExp(`(^|[\\s\\u00a0(«"])(${SHORT_WORDS.join('|')})\\s+`, 'giu');

/** Склеивает короткое слово со следующим неразрывным пробелом, чтобы оно переносилось вместе с ним. */
export const glueShortWords = (text: string): string => {
  let result = text;
  let prev = '';
  // Несколько проходов — для цепочек вроде «и в»
  while (prev !== result) {
    prev = result;
    result = result.replace(GLUE_RE, '$1$2 ');
  }
  return result;
};

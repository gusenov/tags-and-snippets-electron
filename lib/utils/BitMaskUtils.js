export class BitMaskUtils {
  constructor() {
  }

  // Множество битовых масок
  // включенных в заданную сумму битовых масок bitMaskSum
  // или исключенных из заданной суммы битовых масок bitMaskSum:
  static filterBitMasks(bitMasks, bitMaskSum, isIncluded) {
    return new Set([...bitMasks].filter(
      function (bitMask) {
        if (isIncluded) {
          return bitMaskSum.and(bitMask).compare(0) !== 0
        } else {
          return bitMaskSum.and(bitMask).compare(0) === 0
        }
      }
    ))
  }

  static isBitMaskIncludedInBitMaskSum(bitMask, bitMaskSum) {
    return bitMaskSum.and(bitMask).compare(0) !== 0
  }
}

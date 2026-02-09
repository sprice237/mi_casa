/**
 * This function takes an array of days of the week encoded in a 7 bit long number
 * and returns an array of the enabled values
 */
export const getDowArrayFromBitfield = (bitwiseDaysOfWeek: number): number[] => {
  const a: number[] = [];

  for (let i = 0; i < 7; ++i) {
    if (bitwiseDaysOfWeek & 0x1) {
      a.push(i)
    }

    bitwiseDaysOfWeek >>= 1;
  }

  return a
}

export const getBitfieldFromDowArray = (enabledDaysOfWeek: number[]): number => {
  let bitfield = 0;

  for (const dow of enabledDaysOfWeek) {
    if (dow >= 0 && dow < 7 && dow % 1 === 0) {
      bitfield = bitfield | Math.pow(2, dow);
    }
  }

  return bitfield;
}
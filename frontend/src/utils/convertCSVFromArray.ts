export const convertCSVFromArray = <T>(objArray: T[]): string => {
  const array = objArray;
  if (!Array.isArray(array)) {
    throw new Error('Invalid input');
  }

  /** 1. Objectの Key を headerとして取り出す */
  const str =
    `${Object.keys(array[0] as Record<string, unknown>)
      .map((value) => `"${value}"`)
      .join(',')}` + '\r\n';

  // 2. 各オブジェクトの値をCSVの行として追加する
  return array.reduce((str: string, next: unknown) => {
    str +=
      `${Object.values(next as Record<string, unknown>)
        .map((value) => `"${value}"`)
        .join(',')}` + '\r\n';
    return str;
  }, str);
};

declare module 'jstat' {
  interface StudentT {
    cdf(value: number, df: number): number;
    inv(probability: number, df: number): number;
  }

  interface JStat {
    studentt: StudentT;
  }

  const jStat: JStat;
  export default jStat;
}

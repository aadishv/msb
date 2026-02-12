declare module 'jstat' {
  interface StudentT {
    cdf(value: number, df: number): number;
    inv(probability: number, df: number): number;
  }

  interface CentralF {
    cdf(value: number, df1: number, df2: number): number;
  }

  interface JStat {
    studentt: StudentT;
    centralF: CentralF;
  }

  const jStat: JStat;
  export default jStat;
}

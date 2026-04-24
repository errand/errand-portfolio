declare module 'poisson-disk-sampling' {
  interface PoissonDiskSamplingOptions {
    shape: [number, number];
    minDistance: number;
    maxDistance?: number;
    tries?: number;
  }

  export default class PoissonDiskSampling {
    constructor(options: PoissonDiskSamplingOptions);
    fill(): Array<[number, number]>;
  }
}

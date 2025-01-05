export interface GradientStop {
  offset: number
  color: string
}

type GradientType = 'linear' | 'radial'

export class Gradient {
  public type: GradientType
  public stops: GradientStop[] = []

  constructor(stops: GradientStop[]) {
    this.stops = stops
  }

  public addStop(offset: number, color: string) {
    this.stops.push({ offset, color })
  }
}

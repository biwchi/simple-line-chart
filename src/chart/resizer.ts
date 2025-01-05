interface ResizerOptions {
  onResize: (width: number, height: number) => void
}

export class Resizer {
  private readonly el: HTMLElement
  private readonly options?: ResizerOptions

  constructor(el: HTMLElement, options?: ResizerOptions) {
    this.el = el
    this.options = options

    this.init()
  }

  private init() {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      if (this.options?.onResize) {
        this.options.onResize(
          entry.contentRect.width,
          entry.contentRect.height,
        )
      }
    })

    observer.observe(this.el)
  }
}

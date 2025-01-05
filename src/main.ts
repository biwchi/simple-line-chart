import { setupChart } from './chart'
import { LinearGradient } from './renderer/entities'
import './styles/style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="wrapper">
    <div class="chart-container">
    </div>
  </div>
`

setupChart(document.querySelector<HTMLElement>('.chart-container')!, {
  data: [10, 40, 30, 35, 50, 20, 10, 5],
  grid: {
    margin: [0, 0, 10, 0],
  },
  area: {
    color: new LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#0077b6' }]),
    opacity: 0.5,
  },
})

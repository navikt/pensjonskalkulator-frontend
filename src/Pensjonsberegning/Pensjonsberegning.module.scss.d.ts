import globalClassNames from '../style.d'
declare const classNames: typeof globalClassNames & {
  readonly container: 'container'
  readonly sammenligning: 'sammenligning'
  readonly chart: 'chart'
  readonly toggleGroup: 'toggleGroup'
}
export = classNames

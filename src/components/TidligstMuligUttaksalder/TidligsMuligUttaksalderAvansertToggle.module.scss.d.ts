import globalClassNames from '../../style.d'
declare const classNames: typeof globalClassNames & {
  readonly wrapper: 'wrapper'
  readonly wrapperCard: 'wrapperCard'
  readonly ingress: 'ingress'
  readonly highlighted: 'highlighted'
  readonly readmore: 'readmore'
  readonly alert: 'alert'
}
export = classNames

import globalClassNames from '../style.d'
declare const classNames: typeof globalClassNames & {
  readonly frame: 'frame'
  readonly flex: 'flex'
  readonly padded: 'padded'
}
export = classNames

import globalClassNames from '../../style.d'
declare const classNames: typeof globalClassNames & {
  readonly frame: 'frame'
  readonly frame_hasPadding: 'frame_hasPadding'
}
export = classNames

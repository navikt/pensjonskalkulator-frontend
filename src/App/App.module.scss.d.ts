import globalClassNames from '../style.d'
declare const classNames: typeof globalClassNames & {
  readonly logo: 'logo'
  readonly react: 'react'
  readonly card: 'card'
  readonly button: 'button'
}
export = classNames

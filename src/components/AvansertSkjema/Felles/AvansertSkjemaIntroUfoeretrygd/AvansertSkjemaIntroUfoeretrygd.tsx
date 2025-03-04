import { FormattedMessage } from 'react-intl'

import styles from './AvansertSkjemaIntroUfoeretrygd.module.scss'

export const AvansertSkjemaIntroUfoeretrygd = () => (
  <div className={styles.description}>
    <span className={styles.descriptionText}>
      <FormattedMessage id="beregning.avansert.rediger.inntekt_frem_til_uttak.description_ufoere" />
    </span>
  </div>
)

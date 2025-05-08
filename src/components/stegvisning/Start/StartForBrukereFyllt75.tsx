import { Card } from '@/components/common/Card'
import styles from './Start.module.scss'
import { externalUrls, paths } from '@/router/constants'
import { wrapLogger } from '@/utils/logging'
import { FormattedMessage, useIntl } from 'react-intl'
import { useStegvisningNavigation } from '../stegvisning-hooks'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { getFormatMessageValues } from '@/utils/translations'
import React from 'react'
import clsx from 'clsx'

export function StartForBrukereFyllt75() {
	 const intl = useIntl();
	const [{ onStegvisningCancel }] = useStegvisningNavigation(paths.start)
	const navigateToDinPensjon = () => {
		window.location.href = externalUrls.dinPensjonInnlogget
	}
	
	React.useEffect(() => {
		document.title = intl.formatMessage({
			id: 'stegvisning.start.brukere_fyllt_75aar.title',
		})
	}, [])

	return (
		<Card hasLargePadding hasMargin>
			<div className={clsx(styles.wrapper, styles.wrapperFlexColumn)}>
				 <Heading level="2" size="medium" spacing>
						{`${intl.formatMessage({
							id: 'stegvisning.start.title_brukere_fyllt_75aar',
						})}`}
					</Heading>
					<BodyLong data-testid="start_75">
						<FormattedMessage
							id="stegvisning.start.ingress_brukere_fyllt_75aar"
							values={{
								...getFormatMessageValues(),
							}}
						/>
					</BodyLong>
					<div className={styles.wrapperText}>
						<Button
							data-testid="start_75-go-to-din-pensjon-button"
							type="submit"
							className={styles.button}
							variant="primary"
							onClick={wrapLogger('button klikk', {
								tekst: 'Go til Din pensjon',
							})(navigateToDinPensjon)}
						>
							<FormattedMessage id="stegvisning.start.button_brukere_fyllt_75aar" />
						</Button>
						<Button
							data-testid="startside_75-cancel-button"
							variant="tertiary"
							onClick={wrapLogger('button klikk', {
								tekst: 'Avbryt',
							})(onStegvisningCancel)}
						>
							<FormattedMessage id="stegvisning.start.avbryt_brukere_fyllt_75aar" />
						</Button>
					</div>
			</div>
		</Card>
	)
}
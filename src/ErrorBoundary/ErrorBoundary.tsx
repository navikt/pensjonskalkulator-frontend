import React, { Component, ErrorInfo, ReactNode } from 'react'

import { Alert, Heading } from '@navikt/ds-react'

import { Frame } from '../Frame/Frame'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.error('Successfully caught error by boundary:', error.name)
    // TODO legge til error logging
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Frame padded>
          <Alert variant="error">
            <Heading spacing size="small" level="1">
              Beklager, det har oppstått en feil
            </Heading>
            Lorem ipsum dolor sit amet
          </Alert>
        </Frame>
      )
    }

    return this.props.children
  }
}

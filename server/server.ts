import path from 'path'

import { ecsFormat } from '@elastic/ecs-winston-format'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { isBefore, isSameDay } from 'date-fns'
import express, { NextFunction, Request, Response } from 'express'
import promBundle from 'express-prom-bundle'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { initialize } from 'unleash-client'
import winston from 'winston'

import type { components } from '../src/types/schema.d.ts'

import { ensureEnv } from './ensureEnv.js'

type Person = components['schemas']['PersonV2']

const metricsMiddleware = promBundle({ includeMethod: true })

const logger = winston.createLogger({
  format: ecsFormat({
    convertReqRes: true,
  }),
  transports: [new winston.transports.Console()],
})

const env = ensureEnv({
  unleashUrl: 'UNLEASH_SERVER_API_URL',
  unleashToken: 'UNLEASH_SERVER_API_TOKEN',
  unleashEnv: 'UNLEASH_SERVER_API_ENV',
  detaljertKalkulatorUrl: 'DETALJERT_KALKULATOR_URL',
})

// TODO: Sjekk om man kan gjenbruke koden i utils/alders.ts
export const isFoedtFoer1963 = (foedselsdato: string): boolean => {
  const LAST_DAY_1962 = new Date(1962, 11, 31)
  return (
    isBefore(new Date(foedselsdato), LAST_DAY_1962) ||
    isSameDay(new Date(foedselsdato), LAST_DAY_1962)
  )
}

const unleash = initialize({
  url: `${env.unleashUrl}/api`,
  appName: 'pensjonskalkulator-frontend',
  environment: env.unleashEnv,
  customHeaders: {
    Authorization: env.unleashToken,
  },
})

const AUTH_PROVIDER = (() => {
  const idporten: boolean = !!process.env.TOKEN_X_ISSUER
  const azure: boolean = !!process.env.AZURE_OPENID_CONFIG_ISSUER
  if (idporten && azure) {
    throw new Error(
      'Both TOKEN_X_ISSUER (idporten) and AZURE_OPENID_CONFIG_ISSUER are set. Only one of these can be set.'
    )
  }

  if (!idporten && !azure) {
    throw new Error('No auth provider is set')
  }

  if (idporten) {
    return 'idporten'
  }

  if (azure) {
    return 'azure'
  }
})() as 'idporten' | 'azure'

// TokenX is needed for token exchange from idporten to Nav token
if (AUTH_PROVIDER === 'idporten' && !process.env.TOKEN_X_ISSUER) {
  throw Error('Missing TOKEN_X_ISSUER')
}

const OBO_AUDIENCE = (() => {
  if (AUTH_PROVIDER === 'idporten') {
    return process.env.TOKEN_X_OBO_AUDIENCE
  } else if (AUTH_PROVIDER === 'azure') {
    return process.env.ENTRA_ID_OBO_SCOPE
  }
})() as string

const PORT = 8080
const PENSJONSKALKULATOR_BACKEND =
  process.env.PENSJONSKALKULATOR_BACKEND ?? 'http://localhost:8081'

const app = express()
const __dirname = process.cwd()

app.use(metricsMiddleware)
app.use((req, _res, next) => {
  if (!req.headers['x_correlation-id']) {
    req.headers['x_correlation-id'] = crypto.randomUUID()
  }
  next()
})

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const logMetadata = {
      url: req.originalUrl,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      'x_correlation-id': req.headers['x_correlation-id'],
    }

    const logMessage = `${req.method} ${req.path} ${res.statusCode}`
    if (res.statusCode >= 400) {
      logger.error(logMessage, logMetadata)
    } else {
      logger.info(logMessage, logMetadata)
    }
  })
  next()
})
// Server hele assets mappen uten autentisering
app.use(
  '/pensjon/kalkulator/assets',
  (req: Request, res: Response, next: NextFunction) => {
    const assetFolder = path.join(__dirname, 'assets')
    return express.static(assetFolder)(req, res, next)
  }
)

// Dunno, nais.js. Vet ikke hva den gjør
app.use(
  '/pensjon/kalkulator/src',
  (req: Request, res: Response, next: NextFunction) => {
    const srcFolder = path.join(__dirname, 'src')
    return express.static(srcFolder)(req, res, next)
  }
)

const getOboToken = async (req: Request) => {
  const token = getToken(req)
  if (!token) {
    logger.info('No token found in request', {
      'x_correlation-id': req.headers['x_correlation-id'],
    })
    throw new Error('403')
  }

  const validationResult = await validateToken(token)
  if (!validationResult.ok) {
    logger.error('Failed to validate token', {
      error: validationResult.error.message,
      errorType: validationResult.errorType,
      'x_correlation-id': req.headers['x_correlation-id'],
    })
    throw new Error('401')
  }

  const obo = await requestOboToken(token, OBO_AUDIENCE)
  if (!obo.ok) {
    logger.error('Failed to get OBO token', {
      error: obo.error.message,
      'x_correlation-id': req.headers['x_correlation-id'],
    })
    throw new Error('401')
  }
  return obo.token
}

// Proxy til backend med token exchange
app.use(
  '/pensjon/kalkulator/api',
  async (req: Request, res: Response, next: NextFunction) => {
    let oboToken: string
    try {
      oboToken = await getOboToken(req)
    } catch {
      // TODO: Handle in a better way
      res.sendStatus(401)
      return
    }

    return createProxyMiddleware({
      target: `${PENSJONSKALKULATOR_BACKEND}/api`,
      headers: {
        Authorization: `Bearer ${oboToken}`,
      },
      logger: logger,
    })(req, res, next)
  }
)

app.use(
  '/pensjon/kalkulator/v3/api-docs',
  createProxyMiddleware({
    target: `${PENSJONSKALKULATOR_BACKEND}/v3/api-docs`,
    logger: logger,
  })
)

// Kubernetes probes
app.get('/internal/health/liveness', (_req: Request, res: Response) => {
  res.sendStatus(200)
})

app.get('/internal/health/readiness', (_req: Request, res: Response) => {
  res.sendStatus(200)
})

const redirect163Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    'Status of feature toggle pensjonskalkulator.enable-redirect-1963',
    unleash.isEnabled('pensjonskalkulator.enable-redirect-1963')
  )
  if (!unleash.isEnabled('pensjonskalkulator.enable-redirect-1963')) {
    console.log('Feature flag is not enabled')
    next()
    return
  }

  try {
    const oboToken = await getOboToken(req)
    const data = await fetch(`${PENSJONSKALKULATOR_BACKEND}/api/v2/person`, {
      headers: new Headers({
        Authorization: `Bearer ${oboToken}`,
      }),
    })

    const person = (await data.json()) as Person
    if (isFoedtFoer1963(person.foedselsdato)) {
      res.redirect('https://wwww.vg.no') // TODO: Redirect til gammel kalkulator
      return
    }
    console.log('Person ikke foedt etter 1963')
    next()
  } catch (e) {
    console.error('Bruker er ikke logget inn eller har ikke gyldig token: ', e)
    next()
  }
}

// For alle andre endepunkt svar med /veileder/veileder.html (siden vi bruker react-router)
app.get('/pensjon/kalkulator/veileder?*', (_req: Request, res: Response) => {
  if (AUTH_PROVIDER === 'azure') {
    return res.sendFile(__dirname + '/veileder/index.html')
  } else {
    return res.redirect('/pensjon/kalkulator')
  }
})

app.get('*', redirect163Middleware, async (req: Request, res: Response) => {
  if (AUTH_PROVIDER === 'idporten') {
    res.sendFile(__dirname + '/index.html')
  } else if (AUTH_PROVIDER === 'azure') {
    return res.redirect('/pensjon/kalkulator/veileder')
  }
})

app.listen(PORT, () => {
  logger.info(
    `Server is running on http://localhost:${PORT} using ${AUTH_PROVIDER} as auth provider`
  )
})

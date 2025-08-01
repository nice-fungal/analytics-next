/* eslint-disable @typescript-eslint/no-floating-promises */
// import { getCDN, setGlobalCDNUrl } from '../lib/parse-cdn'
import { setVersionType } from '../lib/version-type'

// if (process.env.ASSET_PATH) {
//   if (process.env.ASSET_PATH === '/dist/umd/') {
//     // @ts-ignore
//     __webpack_public_path__ = '/dist/umd/'
//   } else {
//     const cdn = getCDN()
//     setGlobalCDNUrl(cdn)

//     // @ts-ignore
//     __webpack_public_path__ = cdn
//       ? cdn + '/analytics-next/bundles/'
//       : 'https://cdn.segment.com/analytics-next/bundles/'
//   }
// }

setVersionType('web')

import { install } from './standalone-analytics'
// import '../lib/csp-detection'
// import { RemoteMetrics } from '../core/stats/remote-metrics'
// import { embeddedWriteKey } from '../lib/embedded-write-key'
// import {
//   loadAjsClassicFallback,
//   isAnalyticsCSPError,
// } from '../lib/csp-detection'

// let ajsIdentifiedCSP = false

// const sendErrorMetrics = (tags: string[]) => {
//   // this should not be instantied at the root, or it will break ie11.
//   const metrics = new RemoteMetrics()
//   metrics.increment('analytics_js.invoke.error', [
//     ...tags,
//     `wk:${embeddedWriteKey()}`,
//   ])
// }

// function onError(err?: unknown) {
//   console.error('[analytics.js]', 'Failed to load Analytics.js', err)
//   sendErrorMetrics([
//     'type:initialization',
//     ...(err instanceof Error
//       ? [`message:${err?.message}`, `name:${err?.name}`]
//       : []),
//   ])
// }

// document.addEventListener('securitypolicyviolation', (e) => {
//   if (ajsIdentifiedCSP || !isAnalyticsCSPError(e)) {
//     return
//   }
//   ajsIdentifiedCSP = true
//   sendErrorMetrics(['type:csp'])
//   loadAjsClassicFallback().catch(console.error)
// })

// /**
//  * Attempts to run a promise and catch both sync and async errors.
//  **/
// async function attempt<T>(promise: () => Promise<T>) {
//   try {
//     const result = await promise()
//     return result
//   } catch (err) {
//     onError(err)
//   }
// }

// attempt(install)
install()

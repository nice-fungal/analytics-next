// import { Integrations, JSONObject } from '../../core/events'
// import { Alias, Facade, Group, Identify, Page, Track } from '@head.js/analytics.js-facade'
// import { Analytics, InitOptions } from '../../core/analytics'
// import { CDNSettings } from '../../browser'
// import { isOffline, isOnline } from '../../core/connection'
// import { Context, ContextCancelation } from '../../core/context'
// import { isServer } from '../../core/environment'
// import { InternalPluginWithAddMiddleware, Plugin } from '../../core/plugin'
// import { attempt } from '@segment/analytics-core'
// import { isPlanEventEnabled } from '../../lib/is-plan-event-enabled'
// import { mergedOptions } from '../../lib/merged-options'
// import { pWhile } from '../../lib/p-while'
// import { PriorityQueue } from '../../lib/priority-queue'
// import { PersistedPriorityQueue } from '../../lib/priority-queue/persisted'
// import {
//   applyDestinationMiddleware,
//   DestinationMiddlewareFunction,
// } from '../middleware'
// import {
//   buildIntegration,
//   loadIntegration,
//   resolveIntegrationNameFromSource,
//   resolveVersion,
//   unloadIntegration,
// } from './loader'
// import { LegacyIntegration, ClassicIntegrationSource } from './types'
// import { isPlainObject } from '@segment/analytics-core'
// import {
//   isDisabledIntegration as shouldSkipIntegration,
//   isInstallableIntegration,
// } from './utils'
// import { recordIntegrationMetric } from '../../core/stats/metric-helpers'
// import { createDeferred } from '@segment/analytics-generic-utils'

// export type ClassType<T> = new (...args: unknown[]) => T

// async function flushQueue(
//   xt: Plugin,
//   queue: PriorityQueue<Context>
// ): Promise<PriorityQueue<Context>> {
//   const failedQueue: Context[] = []

//   if (isOffline()) {
//     return queue
//   }

//   await pWhile(
//     () => queue.length > 0 && isOnline(),
//     async () => {
//       const ctx = queue.pop()
//       if (!ctx) {
//         return
//       }

//       const result = await attempt(ctx, xt)
//       const success = result instanceof Context
//       if (!success) {
//         failedQueue.push(ctx)
//       }
//     }
//   )

//   // re-add failed tasks
//   failedQueue.map((failed) => queue.pushWithBackoff(failed))
//   return queue
// }

// export class LegacyDestination implements InternalPluginWithAddMiddleware {
//   name: string
//   version: string
//   settings: JSONObject
//   options: InitOptions = {}
//   readonly type = 'destination'
//   middleware: DestinationMiddlewareFunction[] = []

//   private _ready: boolean | undefined
//   private _initialized: boolean | undefined
//   private onReady: Promise<unknown> | undefined
//   private initializePromise = createDeferred<boolean>()
//   private disableAutoISOConversion: boolean

//   integrationSource?: ClassicIntegrationSource
//   integration: LegacyIntegration | undefined

//   buffer: PriorityQueue<Context>
//   flushing = false

//   constructor(
//     name: string,
//     version: string,
//     writeKey: string,
//     settings: JSONObject = {},
//     options: InitOptions,
//     integrationSource?: ClassicIntegrationSource
//   ) {
//     this.name = name
//     this.version = version
//     this.settings = { ...settings }
//     this.disableAutoISOConversion = options.disableAutoISOConversion || false
//     this.integrationSource = integrationSource

//     // AJS-Renderer sets an extraneous `type` setting that clobbers
//     // existing type defaults. We need to remove it if it's present
//     if (this.settings['type'] && this.settings['type'] === 'browser') {
//       delete this.settings['type']
//     }

//     this.initializePromise.promise.then(
//       (isInitialized) => (this._initialized = isInitialized),
//       () => {}
//     )

//     this.options = options
//     this.buffer = options.disableClientPersistence
//       ? new PriorityQueue(4, [])
//       : new PersistedPriorityQueue(4, `${writeKey}:dest-${name}`)

//     this.scheduleFlush()
//   }

//   isLoaded(): boolean {
//     return !!this._ready
//   }

//   ready(): Promise<unknown> {
//     return this.initializePromise.promise.then(
//       () => this.onReady ?? Promise.resolve()
//     )
//   }

//   async load(ctx: Context, analyticsInstance: Analytics): Promise<void> {
//     if (this._ready || this.onReady !== undefined) {
//       return
//     }

//     const integrationSource =
//       this.integrationSource ??
//       (await loadIntegration(
//         ctx,
//         this.name,
//         this.version,
//         this.options.obfuscate
//       ))

//     this.integration = buildIntegration(
//       integrationSource,
//       this.settings,
//       analyticsInstance
//     )

//     this.onReady = new Promise((resolve) => {
//       const onReadyFn = (): void => {
//         this._ready = true
//         resolve(true)
//       }

//       this.integration!.once('ready', onReadyFn)
//     })

//     this.integration!.on('initialize', () => {
//       this.initializePromise.resolve(true)
//     })

//     try {
//       recordIntegrationMetric(ctx, {
//         integrationName: this.name,
//         methodName: 'initialize',
//         type: 'classic',
//       })
//       this.integration.initialize()
//     } catch (error) {
//       recordIntegrationMetric(ctx, {
//         integrationName: this.name,
//         methodName: 'initialize',
//         type: 'classic',
//         didError: true,
//       })
//       this.initializePromise.resolve(false)
//       throw error
//     }
//   }

//   unload(_ctx: Context, _analyticsInstance: Analytics): Promise<void> {
//     return unloadIntegration(this.name, this.version, this.options.obfuscate)
//   }

//   addMiddleware(...fn: DestinationMiddlewareFunction[]): void {
//     this.middleware = this.middleware.concat(...fn)
//   }

//   shouldBuffer(ctx: Context): boolean {
//     return (
//       // page events can't be buffered because of destinations that automatically add page views
//       ctx.event.type !== 'page' &&
//       (isOffline() || this._ready !== true || this._initialized !== true)
//     )
//   }

//   private async send<T extends Facade>(
//     ctx: Context,
//     clz: ClassType<T>,
//     eventType: 'track' | 'identify' | 'page' | 'alias' | 'group'
//   ): Promise<Context> {
//     if (this.shouldBuffer(ctx)) {
//       this.buffer.push(ctx)
//       this.scheduleFlush()
//       return ctx
//     }

//     const plan = this.options?.plan?.track
//     const ev = ctx.event.event

//     if (plan && ev && this.name !== 'Segment.io') {
//       // events are always sent to segment (legacy behavior)
//       const planEvent = plan[ev]
//       if (!isPlanEventEnabled(plan, planEvent)) {
//         ctx.updateEvent('integrations', {
//           ...ctx.event.integrations,
//           All: false,
//           'Segment.io': true,
//         })
//         ctx.cancel(
//           new ContextCancelation({
//             retry: false,
//             reason: `Event ${ev} disabled for integration ${this.name} in tracking plan`,
//             type: 'Dropped by plan',
//           })
//         )
//       } else {
//         ctx.updateEvent('integrations', {
//           ...ctx.event.integrations,
//           ...planEvent?.integrations,
//         })
//       }

//       if (planEvent?.enabled && planEvent?.integrations![this.name] === false) {
//         ctx.cancel(
//           new ContextCancelation({
//             retry: false,
//             reason: `Event ${ev} disabled for integration ${this.name} in tracking plan`,
//             type: 'Dropped by plan',
//           })
//         )
//       }
//     }

//     const afterMiddleware = await applyDestinationMiddleware(
//       this.name,
//       ctx.event,
//       this.middleware
//     )

//     if (afterMiddleware === null) {
//       return ctx
//     }

//     const event = new clz(afterMiddleware, {
//       traverse: !this.disableAutoISOConversion,
//     })

//     recordIntegrationMetric(ctx, {
//       integrationName: this.name,
//       methodName: eventType,
//       type: 'classic',
//     })

//     try {
//       if (this.integration) {
//         await this.integration!.invoke.call(this.integration, eventType, event)
//       }
//     } catch (err) {
//       recordIntegrationMetric(ctx, {
//         integrationName: this.name,
//         methodName: eventType,
//         type: 'classic',
//         didError: true,
//       })
//       throw err
//     }

//     return ctx
//   }

//   async track(ctx: Context): Promise<Context> {
//     return this.send(ctx, Track as ClassType<Track>, 'track')
//   }

//   async page(ctx: Context): Promise<Context> {
//     if (this.integration?._assumesPageview && !this._initialized) {
//       this.integration.initialize()
//     }

//     await this.initializePromise.promise
//     return this.send(ctx, Page as ClassType<Page>, 'page')
//   }

//   async identify(ctx: Context): Promise<Context> {
//     return this.send(ctx, Identify as ClassType<Identify>, 'identify')
//   }

//   async alias(ctx: Context): Promise<Context> {
//     return this.send(ctx, Alias as ClassType<Alias>, 'alias')
//   }

//   async group(ctx: Context): Promise<Context> {
//     return this.send(ctx, Group as ClassType<Group>, 'group')
//   }

//   private scheduleFlush(): void {
//     if (this.flushing) {
//       return
//     }

//     // eslint-disable-next-line @typescript-eslint/no-misused-promises
//     setTimeout(async () => {
//       if (isOffline() || this._ready !== true || this._initialized !== true) {
//         this.scheduleFlush()
//         return
//       }

//       this.flushing = true
//       this.buffer = await flushQueue(this, this.buffer)
//       this.flushing = false

//       if (this.buffer.todo > 0) {
//         this.scheduleFlush()
//       }
//     }, Math.random() * 5000)
//   }
// }

// export function ajsDestinations(
//   writeKey: string,
//   settings: CDNSettings,
//   globalIntegrations: Integrations = {},
//   options: InitOptions = {},
//   routingMiddleware?: DestinationMiddlewareFunction,
//   legacyIntegrationSources?: ClassicIntegrationSource[]
// ): LegacyDestination[] {
//   if (isServer()) {
//     return []
//   }

//   if (settings.plan) {
//     options = options ?? {}
//     options.plan = settings.plan
//   }

//   const routingRules = settings.middlewareSettings?.routingRules ?? []
//   const remoteIntegrationsConfig = settings.integrations
//   const localIntegrationsConfig = options.integrations
//   // merged remote CDN settings with user provided options
//   const integrationOptions = mergedOptions(settings, options ?? {}) as Record<
//     string,
//     JSONObject
//   >

//   const adhocIntegrationSources = legacyIntegrationSources?.reduce(
//     (acc, integrationSource) => ({
//       ...acc,
//       [resolveIntegrationNameFromSource(integrationSource)]: integrationSource,
//     }),
//     {} as Record<string, ClassicIntegrationSource>
//   )

//   const installableIntegrations = new Set([
//     // Remotely configured installable integrations
//     ...Object.keys(remoteIntegrationsConfig).filter((name) =>
//       isInstallableIntegration(name, remoteIntegrationsConfig[name])
//     ),

//     // Directly provided integration sources are only installable if settings for them are available
//     ...Object.keys(adhocIntegrationSources || {}).filter(
//       (name) =>
//         isPlainObject(remoteIntegrationsConfig[name]) ||
//         isPlainObject(localIntegrationsConfig?.[name])
//     ),
//   ])

//   return Array.from(installableIntegrations)
//     .filter((name) => !shouldSkipIntegration(name, globalIntegrations))
//     .map((name) => {
//       const integrationSettings = remoteIntegrationsConfig[name]
//       const version = resolveVersion(integrationSettings)
//       const destination = new LegacyDestination(
//         name,
//         version,
//         writeKey,
//         integrationOptions[name],
//         options,
//         adhocIntegrationSources?.[name]
//       )

//       const routing = routingRules.filter(
//         (rule) => rule.destinationName === name
//       )
//       if (routing.length > 0 && routingMiddleware) {
//         destination.addMiddleware(routingMiddleware)
//       }

//       return destination
//     })
// }

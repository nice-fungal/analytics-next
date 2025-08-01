// import { CDNSettings } from '../../browser'
// import { Context } from '../../core/context'
// import { PlanEvent, TrackPlan } from '../../core/events/interfaces'
// import { Plugin } from '../../core/plugin'
// import { isPlanEventEnabled } from '../../lib/is-plan-event-enabled'
// import { RemotePlugin } from '../remote-loader'

// function disabledActionDestinations(
//   plan: PlanEvent | undefined,
//   settings: CDNSettings
// ): { [destination: string]: string[] } {
//   if (!plan || !Object.keys(plan)) {
//     return {}
//   }

//   const disabledIntegrations = plan.integrations
//     ? Object.keys(plan.integrations).filter(
//         (i) => plan.integrations![i] === false
//       )
//     : []

//   // This accounts for cases like Fullstory, where the settings.integrations
//   // contains a "Fullstory" object but settings.remotePlugins contains "Fullstory (Actions)"
//   const disabledRemotePlugins: string[] = []
//   ;(settings.remotePlugins ?? []).forEach((p: RemotePlugin) => {
//     disabledIntegrations.forEach((int) => {
//       if (p.creationName == int) {
//         disabledRemotePlugins.push(p.name)
//       }
//     })
//   })

//   return (settings.remotePlugins ?? []).reduce((acc, p) => {
//     if (p.settings['subscriptions']) {
//       if (disabledRemotePlugins.includes(p.name)) {
//         // @ts-expect-error element implicitly has an 'any' type because p.settings is a JSONObject
//         p.settings['subscriptions'].forEach(
//           // @ts-expect-error parameter 'sub' implicitly has an 'any' type
//           (sub) => (acc[`${p.name} ${sub.partnerAction}`] = false)
//         )
//       }
//     }
//     return acc
//   }, {})
// }

// export function schemaFilter(
//   track: TrackPlan | undefined,
//   settings: CDNSettings
// ): Plugin {
//   function filter(ctx: Context): Context {
//     const plan = track
//     const ev = ctx.event.event

//     if (plan && ev) {
//       const planEvent = plan[ev]
//       if (!isPlanEventEnabled(plan, planEvent)) {
//         ctx.updateEvent('integrations', {
//           ...ctx.event.integrations,
//           All: false,
//           'Segment.io': true,
//         })
//         return ctx
//       } else {
//         const disabledActions = disabledActionDestinations(planEvent, settings)

//         ctx.updateEvent('integrations', {
//           ...ctx.event.integrations,
//           ...planEvent?.integrations,
//           ...disabledActions,
//         })
//       }
//     }

//     return ctx
//   }

//   return {
//     name: 'Schema Filter',
//     version: '0.1.0',
//     isLoaded: () => true,
//     load: () => Promise.resolve(),
//     type: 'before',
//     page: filter,
//     alias: filter,
//     track: filter,
//     identify: filter,
//     group: filter,
//   }
// }

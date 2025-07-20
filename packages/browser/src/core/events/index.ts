import { v4 as uuid } from '@lukeed/uuid'
import { /* ID, */ User } from '../user'
import {
  Options,
  Integrations,
  EventProperties,
  // Traits,
  SegmentEvent,
} from './interfaces'
import { addPageContext, PageContext } from '../page'
import { CoreEventFactory } from '@segment/analytics-core'

export * from './interfaces'

export class EventFactory extends CoreEventFactory {
  user: User
  constructor(user: User) {
    super({
      createMessageId: () => `ajs-next-${Date.now()}-${uuid()}`,
      onEventMethodCall: ({ options }) => {
        this.maybeUpdateAnonId(options)
      },
      onFinishedEvent: (event) => {
        this.addIdentity(event)
        return event
      },
    })
    this.user = user
  }

  /**
   * Updates the anonymousId *globally* if it's provided in the options.
   * This should generally be done in the identify method, but some customers rely on this.
   */
  private maybeUpdateAnonId(options: Options | undefined): void {
    options?.anonymousId && this.user.anonymousId(options.anonymousId)
  }

  /**
   * add user id / anonymous id to the event
   */
  private addIdentity(event: SegmentEvent) {
    if (this.user.id()) {
      event.userId = this.user.id()
    }

    if (this.user.anonymousId()) {
      event.anonymousId = this.user.anonymousId()
    }
  }

  override track(
    event: string,
    properties?: EventProperties,
    options?: Options,
    globalIntegrations?: Integrations,
    pageCtx?: PageContext
  ): SegmentEvent {
    const ev = super.track(event, properties, options, globalIntegrations)
    addPageContext(ev, pageCtx)
    return ev
  }

  override page(
    category: string | null,
    page: string | null,
    properties?: EventProperties,
    options?: Options,
    globalIntegrations?: Integrations,
    pageCtx?: PageContext
  ): SegmentEvent {
    const ev = super.page(
      category,
      page,
      properties,
      options,
      globalIntegrations
    )
    addPageContext(ev, pageCtx)
    return ev
  }

  // override screen(
  //   category: string | null,
  //   screen: string | null,
  //   properties?: EventProperties,
  //   options?: Options,
  //   globalIntegrations?: Integrations,
  //   pageCtx?: PageContext
  // ): SegmentEvent {
  //   const ev = super.screen(
  //     category,
  //     screen,
  //     properties,
  //     options,
  //     globalIntegrations
  //   )
  //   addPageContext(ev, pageCtx)
  //   return ev
  // }

  // override identify(
  //   userId: ID,
  //   traits?: Traits,
  //   options?: Options,
  //   globalIntegrations?: Integrations,
  //   pageCtx?: PageContext
  // ): SegmentEvent {
  //   const ev = super.identify(userId, traits, options, globalIntegrations)
  //   addPageContext(ev, pageCtx)
  //   return ev
  // }

  // override group(
  //   groupId: ID,
  //   traits?: Traits,
  //   options?: Options,
  //   globalIntegrations?: Integrations,
  //   pageCtx?: PageContext
  // ): SegmentEvent {
  //   const ev = super.group(groupId, traits, options, globalIntegrations)
  //   addPageContext(ev, pageCtx)
  //   return ev
  // }

  // override alias(
  //   to: string,
  //   from: string | null,
  //   options?: Options,
  //   globalIntegrations?: Integrations,
  //   pageCtx?: PageContext
  // ): SegmentEvent {
  //   const ev = super.alias(to, from, options, globalIntegrations)
  //   addPageContext(ev, pageCtx)
  //   return ev

  // private baseEvent(): Partial<SegmentEvent> {
  //   const base: Partial<SegmentEvent> = {
  //     integrations: {},
  //     options: {},
  //   }

  //   const user = this.user

  //   if (user.id()) {
  //     base.userId = user.id()
  //   }

  //   if (user.anonymousId()) {
  //     base.anonymousId = user.anonymousId()
  //   }

  //   return base
  // }

  /**
   * Builds the context part of an event based on "foreign" keys that
   * are provided in the `Options` parameter for an Event
   */
  // private context(event: SegmentEvent): [object, object] {
  //   const optionsKeys = ['integrations', 'anonymousId', 'timestamp', 'userId']

  //   const options = event.options ?? {}
  //   delete options['integrations']

  //   const providedOptionsKeys = Object.keys(options)

  //   const context = event.options?.context ?? {}
  //   const overrides = {}

  //   providedOptionsKeys.forEach((key) => {
  //     if (key === 'context') {
  //       return
  //     }

  //     if (optionsKeys.includes(key)) {
  //       dset(overrides, key, options[key])
  //     } else {
  //       dset(context, key, options[key])
  //     }
  //   })

  //   return [context, overrides]
  // }

  // public normalize(event: SegmentEvent, pageCtx?: PageContext): SegmentEvent {
  //   // set anonymousId globally if we encounter an override
  //   //segment.com/docs/connections/sources/catalog/libraries/website/javascript/identity/#override-the-anonymous-id-using-the-options-object
  //   event.options?.anonymousId &&
  //     this.user.anonymousId(event.options.anonymousId)

  //   const integrationBooleans = Object.keys(event.integrations ?? {}).reduce(
  //     (integrationNames, name) => {
  //       return {
  //         ...integrationNames,
  //         [name]: Boolean(event.integrations?.[name]),
  //       }
  //     },
  //     {} as Record<string, boolean>
  //   )

  //   // This is pretty trippy, but here's what's going on:
  //   // - a) We don't pass initial integration options as part of the event, only if they're true or false
  //   // - b) We do accept per integration overrides (like integrations.Amplitude.sessionId) at the event level
  //   // Hence the need to convert base integration options to booleans, but maintain per event integration overrides
  //   const allIntegrations = {
  //     // Base config integrations object as booleans
  //     ...integrationBooleans,

  //     // Per event overrides, for things like amplitude sessionId, for example
  //     ...event.options?.integrations,
  //   }

  //   const [context, overrides] = this.context(event)
  //   const { options, ...rest } = event

  //   const newEvent: SegmentEvent = {
  //     timestamp: new Date(),
  //     ...rest,
  //     context,
  //     integrations: allIntegrations,
  //     ...overrides,
  //     messageId: 'ajs-next-' + md5.hash(JSON.stringify(event) + uuid()),
  //   }
  //   addPageContext(newEvent, pageCtx)

  //   return newEvent
  // }
}

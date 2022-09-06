import { CoreContext, ContextCancelation } from '../context'
import { CorePlugin } from '../plugins'
async function tryOperation(
  op: () => CoreContext | Promise<CoreContext>
): Promise<CoreContext> {
  try {
    return await op()
  } catch (err) {
    return Promise.reject(err)
  }
}

export function attempt(
  ctx: CoreContext,
  plugin: CorePlugin
): Promise<CoreContext | ContextCancelation | Error | undefined> {
  ctx.log('debug', 'plugin', { plugin: plugin.name })
  const start = new Date().getTime()

  const hook = plugin[ctx.event.type]
  if (hook === undefined) {
    return Promise.resolve(ctx)
  }

  const newCtx = tryOperation(() => hook.apply(plugin, [ctx]))
    .then((ctx) => {
      const done = new Date().getTime() - start
      ctx.stats?.gauge('plugin_time', done, [`plugin:${plugin.name}`])

      return ctx
    })
    .catch((err) => {
      if (
        err instanceof ContextCancelation &&
        err.type === 'middleware_cancellation'
      ) {
        throw err
      }

      if (err instanceof ContextCancelation) {
        ctx.log('warn', err.type, {
          plugin: plugin.name,
          error: err,
        })

        return err
      }

      ctx.log('error', 'plugin Error', {
        plugin: plugin.name,
        error: err,
      })
      ctx.stats?.increment('plugin_error', 1, [`plugin:${plugin.name}`])

      return err as Error
    })

  return newCtx
}

export function ensure(
  ctx: CoreContext,
  plugin: CorePlugin
): Promise<CoreContext | undefined> {
  return attempt(ctx, plugin).then((newContext) => {
    if (newContext instanceof CoreContext) {
      return newContext
    }

    ctx.log('debug', 'Context canceled')
    ctx.stats?.increment('context_canceled')
    ctx.cancel(newContext)
  })
}

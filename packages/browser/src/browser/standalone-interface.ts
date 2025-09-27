import { Analytics, AnalyticsSettings, InitOptions } from '../core/analytics'

export interface AnalyticsSnippet extends AnalyticsStandalone {
  load: (writeKey: string, options?: InitOptions) => void
}

export interface AnalyticsStandalone extends Analytics {
  _loadSettings?: AnalyticsSettings
  _loadOptions?: InitOptions
  _writeKey?: string
  _cdn?: string
}

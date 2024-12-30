import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(feed)` | `/(feed)/` | `/(feed)/write-button` | `/_sitemap` | `/profile` | `/write-button`
      DynamicRoutes: `/(feed)/post/${OneRouter.SingleRoutePart<T>}` | `/post/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/(feed)/post/[id]` | `/post/[id]`
      IsTyped: true
    }
  }
}
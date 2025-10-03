/// <reference path="../../../server/app/middleware/guest_middleware.ts" />

import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from '@pulsefeed/server/api'

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
  baseUrl: 'http://localhost:3333',
})

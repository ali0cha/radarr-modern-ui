import { QueryClient } from '@tanstack/react-query';

// Shared so that code living outside of React, such as the SignalR handlers,
// can update the cache.
export const queryClient = new QueryClient();

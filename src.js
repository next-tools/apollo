import { useMemo } from "react";

export default function (createApolloClient) {
  let apolloClient;

  const initApollo = function (initState = null, opts) {
    const _apolloClient = apolloClient ?? createApolloClient(opts);

    if (initState) {
      _apolloClient.cache.restore(initState);
    }

    if (typeof window === "undefined") {
      return _apolloClient;
    }

    if (!apolloClient) {
      apolloClient = _apolloClient;
    }

    return _apolloClient;
  };

  const useApollo = function (initState, opts) {
    const apolloClient = useMemo(() => initApollo(initState, opts), [
      initState,
      opts
    ]);

    return apolloClient;
  };

  return { initApollo, useApollo };
}

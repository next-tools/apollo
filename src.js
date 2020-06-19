import { useMemo } from "react";

export default function (createApolloClient) {
  let apolloClient;

  const initApollo = function (initState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

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

  const useApollo = function (initState) {
    const apolloClient = useMemo(() => initApollo(initState), [initState]);

    return apolloClient;
  };

  return { initApollo, useApollo };
}

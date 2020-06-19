# Next js with apollo

Default and only export is a generator that you pass your client creation function into. It returns two functions that allow you to access the apollo client in the context of a react component or any other context that may have to do with pre-rendering on the server or client in next js.

1. `initApollo` - Function that takes a single optional argument which is initial state to hydrate the cache. This function can be used inside `getServerSideProps`, `getStaticProps`, and `getInitialProps`.
2. `useApollo` - Hook version of initApollo. Used in a react component, typically in `pages/_app.js` to supply the ApolloProvider.

This uses the exact concepts from the latest next js examples git repository for using apollo with next js. [https://github.com/vercel/next.js/tree/canary/examples/with-apollo](https://github.com/vercel/next.js/tree/canary/examples/with-apollo) It is packaged up for convienience so you don't have to keep having to re-writing this functionality and only worry about passing in your apollo client creation function and using the apollo client.

This does NOT use `getDataFromTree`

## Example Usage

1. Create a file that you will export the two generated functions from your client creation function. example path: `~/lib/apollo.js` (where ~ is project root)

   ```js
   import { ApolloClient } from "apollo-client";
   import { InMemoryCache } from "apollo-cache-inmemory";
   import { HttpLink } from "apollo-link-http";
   import nextjsApollo from "next-js-apollo";

   export const { initApollo, useApollo } = nextjsApollo(function () {
     return new ApolloClient({
       ssrMode: typeof window === "undefined",
       link: new HttpLink({
         uri: process.env.API_URL + "/graphql"
       }),
       cache: new InMemoryCache()
     });
   });
   ```

2. Provider in `pages/_app.js`

   ```js
   import { useApollo } from "~/lib/apollo";
   import { ApolloProvider } from "@apollo/react-hooks";

   const App = ({ Component, pageProps }) => {
     const apolloClient = useApollo(pageProps.initApolloState);

     return (
       <ApolloProvider client={apolloClient}>
         <Component {...pageProps} />
       </ApolloProvider>
     );
   };

   export default App;
   ```

3. Usage for ssr in any of the 3 available functions `getServerSideProps`, `getStaticProps`, or `getInitialProps` on a next js `page`

   ```js
   import { initApollo } from "~/lib/apollo";
   import { useQuery } from "@apollo/react-hooks";
   import { SOME_QUERY } from "somwhere";

   const Page = () => {
     const { data } = useQuery(SOME_QUERY);

     return <div>...</div>;
   };

   Page.getInitialProps = async function () {
     const apolloClient = initApollo();

     await apolloClient.query({ query: SOME_QUERY });

     // this hydrates the cache allowing you to useQuery in the componet and be able to ssr with no call to the client
     // if you want to you could pass the apollo data into the page props want to use it directly without useQuery
     return {
       initApolloState: apolloClient.cache.extract()
     };
   };
   ```

   ```js
   import { initApollo } from "~/lib/apollo";
   import { useQuery } from "@apollo/react-hooks";
   import { SOME_QUERY } from "somwhere";

   const Page = () => {
     const { data } = useQuery(SOME_QUERY);

     return <div>...</div>;
   };

   export async function getServerSideProps() {
     const apolloClient = initApollo();

     await apolloClient.query({ query: SOME_QUERY });

     // this hydrates the cache allowing you to useQuery in the componet and be able to ssr with no call to the client
     // if you want to you could pass the apollo data into the page props want to use it directly without useQuery
     return {
       props: {
         initApolloState: apolloClient.cache.extract()
       }
     };
   }
   ```

   ```js
   import { initApollo } from "~/lib/apollo";
   import { useQuery } from "@apollo/react-hooks";
   import { SOME_QUERY } from "somwhere";

   const Page = () => {
     const { data } = useQuery(SOME_QUERY);

     return <div>...</div>;
   };

   export async function getStaticProps() {
     const apolloClient = initApollo();

     await apolloClient.query({ query: SOME_QUERY });

     // this hydrates the cache allowing you to useQuery in the componet and be able to ssr with no call to the client
     // if you want to you could pass the apollo data into the page props want to use it directly without useQuery
     return {
       props: {
         initApolloState: apolloClient.cache.extract()
       }
     };
   }
   ```

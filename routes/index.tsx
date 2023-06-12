// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import ImageUploader from "../islands/ImageUploader.tsx";
//import { State } from "./_middleware.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render({ ...ctx.state });
  },
};

export default function Home(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.session}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        {props.data.session
          ? (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Nice you're logged In!</h1>
              <pre>{JSON.stringify(props.data.session, null, 2)}</pre>
            </div>
          )
          : (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Login to access all pages</h1>
              <a
                href="/login"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </a>
            </div>
          )}
        <ImageUploader />
      </div>
    </Layout>
  );
}

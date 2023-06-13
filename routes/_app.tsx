import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function AppLayout({ Component }: AppProps) {
  const presets = `
  twind.install({
    presets: [
      twind.presetExt()
      twind.presetLineClamp()
      twind.presetTailwindForms()
      twind.presetTypography()
   ],
  })
  `;
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          src="https://cdn.twind.style/ext,line-clamp,forms,typography"
          crossOrigin=""
        />
        <script>
          {presets}
        </script>
        <link rel="stylesheet" href="https://unpkg.com/open-props" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/open-props/animations.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/open-props/gradients.min.css"
        />
      </Head>
      <body class="[background-image:var(--gradient-8)] h-screen text-white border max-w-2xl mx-auto">
        <Component />
      </body>
    </>
  );
}

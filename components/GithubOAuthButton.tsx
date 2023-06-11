import IconBrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx";

export default function GithubOAuthButton() {
  return (
    <form action="/auth/login/oauth" method="POST">
      <input type="hidden" value="github" name="provider" />
      <button
        type="submit"
        class="px-4 py-2 w-full bg-white text-black text-lg rounded-lg border-2 border-black disabled:(opacity-50 cursor-not-allowed)"
      >
        <IconBrandGithub class="w-6 h-6" />
      </button>
    </form>
  );
}

import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";
import Nav from "@/components/Nav.tsx";

interface LayoutProps {
  isLoggedIn: boolean;
  children: ComponentChildren;
}

export default function Layout(props: LayoutProps) {
  return (
    <main class="bg-red-500">
      <Nav active="/" loggedIn={props.isLoggedIn} />
      <div class="p-10 ">
        {props.children}
      </div>
    </main>
  );
}

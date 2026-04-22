import { describe, expect, it } from "vitest";
import { PUBLIC_SITE_SECTION_LINKS } from "@/modules/public-site/application/site-navigation";

describe("site-navigation", () => {
  it("defines the public site section links in the expected order", () => {
    expect(PUBLIC_SITE_SECTION_LINKS).toEqual([
      { id: "home", href: "#home", translationKey: "home" },
      { id: "calendario", href: "#calendario", translationKey: "calendario" },
      { id: "fotos", href: "#fotos", translationKey: "fotos" },
      { id: "contacto", href: "#contacto", translationKey: "contacto" },
    ]);
  });
});
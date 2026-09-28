import { useState } from "react";
import { ContactModal } from "./shared";
import { EngineersPage } from "./engineers-page";
import { CompaniesPage } from "./companies-page";
import { SiteFooter, SiteNav, type Mode } from "./site-chrome";
import { seoFor, useSeo } from "../../lib/seo";

function HomePageInner({ mode }: { mode: Mode }) {
  const [showModal, setShowModal] = useState(false);
  const isE = mode === "engineers";
  useSeo(seoFor(isE ? "/engineers" : "/"));

  return (
    <>
      <SiteNav mode={mode} />

      {/* ═══ PAGE ═══ */}
      <main>
        {isE ? <EngineersPage /> : <CompaniesPage onOpenForm={() => setShowModal(true)} />}
      </main>

      <SiteFooter mode={mode} />

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  );
}

// Route exports
export function HomePage() { return <HomePageInner mode="engineers" />; }
export function CompaniesHomePage() { return <HomePageInner mode="companies" />; }

import AboutSection from "@/components/AboutSection";
import BiosBoot from "@/components/BiosBoot";
import CompanionMascot from "@/components/CompanionMascot";
import ContactSection from "@/components/ContactSection";
import CustomContextMenu from "@/components/CustomContextMenu";
import CustomCursor from "@/components/CustomCursor";
import ExperienceSection from "@/components/ExperienceSection";
import GallerySection from "@/components/GallerySection";
import GuestbookSection from "@/components/GuestbookSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import SetupSection from "@/components/SetupSection";
import SkillsSection from "@/components/SkillsSection";
import SystemConsole from "@/components/SystemConsole";
import type { ContentData } from "@/data/db";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!BACKEND_URL) throw new Error("BACKEND_URL not set");
  const res = await fetch(`${BACKEND_URL.replace(/\/$/, "")}${path}`, {
    next: { revalidate: 60 },
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`fetch ${path} ${res.status}`);
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json && "success" in json) return json.data as T;
  return json as T;
}

export default async function Home() {
  // 100% dari API — tanpa fallback ke content.json
  const [heroRaw, profile, aboutRaw, skillsRaw, projectsRaw, galleryRaw, experiencesRaw, educationsRaw, certificatesRaw, servicesRaw, contactRaw, siteMetaRaw, workspaceRaw] =
    await Promise.all([
      fetchJson<any>("/api/v1/hero"),
      fetchJson<any>("/api/v1/profile"),
      fetchJson<any>("/api/v1/about"),
      fetchJson<any>("/api/v1/skills"),
      fetchJson<any>("/api/v1/projects"),
      fetchJson<any>("/api/v1/gallery"),
      fetchJson<any>("/api/v1/experiences"),
      fetchJson<any>("/api/v1/educations"),
      fetchJson<any>("/api/v1/certificates"),
      fetchJson<any>("/api/v1/services"),
      fetchJson<any>("/api/v1/contact"),
      fetchJson<any>("/api/v1/site-meta"),
      fetchJson<any>("/api/v1/workspace-setup"),
    ]);

  if (!heroRaw) throw new Error("Hero not found — seed backend dulu: bunx prisma db seed");

  const hero: ContentData["hero"] = {
    greeting: heroRaw.greeting ?? "Hello, I'm",
    name: profile?.name ?? "Pito Desri Pauzi",
    titles: heroRaw.titles ?? ["Full Stack Web Developer"],
    subtitle: heroRaw.subtitle ?? "",
    ctaPrimary: {
      label: heroRaw.ctaPrimaryLabel ?? "View My Work",
      href: heroRaw.ctaPrimaryHref ?? "#projects",
    },
    ctaSecondary: {
      label: heroRaw.ctaSecondaryLabel ?? "Contact Me",
      href: heroRaw.ctaSecondaryHref ?? "#contact",
    },
    availableForWork: heroRaw.availableForWork ?? true,
  };

  const about: ContentData["about"] = aboutRaw
    ? { bio: aboutRaw.bio, facts: (aboutRaw.facts ?? []).map((f: any) => ({ value: f.value, label: f.label })) }
    : { bio: "", facts: [] };

  const skills: ContentData["skills"] = (() => {
    if (Array.isArray(skillsRaw) && skillsRaw.length > 0) {
      const map = new Map<string, { name: string; icon: string; items: string[] }>();
      for (const s of skillsRaw as { name: string; category: string }[]) {
        const cat = s.category || "General";
        if (!map.has(cat)) map.set(cat, { name: cat, icon: cat.toLowerCase(), items: [] });
        map.get(cat)!.items.push(s.name);
      }
      return { categories: Array.from(map.values()) };
    }
    return { categories: [] };
  })();

  const services: ContentData["services"] = Array.isArray(servicesRaw) ? (servicesRaw as ContentData["services"]) : [];
  const projects: ContentData["projects"] = Array.isArray(projectsRaw)
    ? (projectsRaw as any[]).map((p, idx) => ({
        id: typeof p.id === "string" ? Math.abs(p.id.split("").reduce((a: number, c: string) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)) : p.id ?? idx,
        title: p.title,
        description: p.description,
        tags: p.tags ?? [],
        liveUrl: p.link ?? "#",
        githubUrl: "#",
        featured: p.featured ?? false,
        gradient: p.gradient ?? "from-blue-500 to-cyan-500",
        imageUrl: p.imageUrl ?? null,
      }))
    : [];
  const gallery = Array.isArray(galleryRaw)
    ? (galleryRaw as any[]).map((g) => ({
        id: typeof g.id === "string" ? Math.abs(g.id.split("").reduce((a: number, c: string) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)) : g.id,
        url: g.url,
        caption: g.caption,
        date: g.date ? new Date(g.date).toISOString().split("T")[0] : "",
      }))
    : [];
  const experiences: ContentData["experience"] = Array.isArray(experiencesRaw) ? (experiencesRaw as ContentData["experience"]) : [];
  const educations: ContentData["education"] = Array.isArray(educationsRaw) ? (educationsRaw as ContentData["education"]) : [];
  const certifications: ContentData["certifications"] = Array.isArray(certificatesRaw)
    ? (certificatesRaw as any[]).map((c) => ({ id: c.id, title: c.title, issuer: c.issuer, date: c.date, imageUrl: c.imageUrl ?? null }))
    : [];

  const contact: ContentData["contact"] = {
    heading: contactRaw?.heading ?? "Let's Build Something Great",
    subheading: contactRaw?.subheading ?? "",
    email: contactRaw?.email ?? profile?.email ?? "",
    social: {
      github: profile?.githubUrl ?? "",
      linkedin: profile?.linkedinUrl ?? "",
      instagram: (profile as any)?.instagramUrl ?? "",
    },
  };

  const meta: ContentData["meta"] = {
    siteTitle: siteMetaRaw?.siteTitle ?? "Pito Desri Pauzi - Portfolio",
    siteDescription: siteMetaRaw?.siteDescription ?? "",
    siteUrl: siteMetaRaw?.siteUrl ?? "https://pitok.my.id",
    ogImage: siteMetaRaw?.ogImage ?? "https://pitok.my.id/pito-desri-pauzi.webp",
  };

  const setup: ContentData["setup"] = workspaceRaw
    ? {
        os: workspaceRaw.os ?? "",
        editor: workspaceRaw.editor ?? "",
        terminal: workspaceRaw.terminal ?? "",
        hardware: workspaceRaw.hardware ?? "",
      }
    : { os: "", editor: "", terminal: "", hardware: "" };

  // features belum ada tabel dedicated — biarkan undefined (default enabled di komponen)
  const features = undefined as ContentData["features"];

  const content: ContentData = {
    hero,
    about,
    skills,
    services,
    projects,
    gallery,
    experience: experiences,
    education: educations,
    certifications,
    contact,
    meta,
    setup,
    features,
  } as ContentData;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    url: content.meta.siteUrl || "https://pitok.my.id",
    image: content.meta.ogImage || "https://pitok.my.id/pito-desri-pauzi.webp",
    jobTitle: content.hero.titles[0],
    alumniOf: { "@type": "EducationalOrganization", name: "Politeknik Negeri Padang" },
    sameAs: [content.contact.social.github, content.contact.social.linkedin, content.contact.social.instagram].filter(Boolean),
    description: content.meta.siteDescription,
    knowsAbout: content.skills.categories.flatMap((cat) => cat.items),
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var b=sessionStorage.getItem('biosBooted');var e=${content.features?.biosBootEnabled !== false};if(e&&b!=='true'){document.documentElement.classList.add('bios-booting')}}catch(e){}})();`,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <CustomCursor />
      <CustomContextMenu features={content.features} />
      <Navbar features={content.features} />
      <main>
        <HeroSection data={content.hero} social={content.contact.social} />
        <AboutSection data={content.about} />
        <SkillsSection data={content.skills} />
        <ServicesSection data={content.services} />
        <ProjectsSection data={content.projects} />
        <GallerySection data={content.gallery || []} />
        <ExperienceSection experience={content.experience} education={content.education} certifications={content.certifications} />
        <GuestbookSection />
        <SetupSection data={content.setup} />
        <ContactSection data={content.contact} />
      </main>
      <footer className="footer">
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            ©{new Date().getFullYear()} <span style={{ fontWeight: 600 }}>Pito Desri Pauzi</span> · <span style={{ color: "var(--accent)" }}>pitok.my.id</span>
          </p>
        </div>
      </footer>
      <SystemConsole features={content.features} />
      <BiosBoot features={content.features} />
      <CompanionMascot />
    </>
  );
}

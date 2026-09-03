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
import { type ContentData, readData } from "@/data/db";

async function getContent() {
  return readData<ContentData>("content", "content.json", {} as ContentData);
}

export default async function Home() {
  const content = await getContent();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    url: content.meta.siteUrl || "https://pitok.my.id",
    image: content.meta.ogImage || "https://pitok.my.id/pito-desri-pauzi.webp",
    jobTitle: content.hero.titles[0],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Politeknik Negeri Padang",
    },
    sameAs: [
      content.contact.social.github,
      content.contact.social.linkedin,
      content.contact.social.instagram,
    ].filter(Boolean),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
        <ExperienceSection
          experience={content.experience}
          education={content.education}
          certifications={content.certifications}
        />
        <GuestbookSection />
        <SetupSection data={content.setup} />
        <ContactSection data={content.contact} />
      </main>

      <footer className="footer">
        <div
          className="section-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            ©{new Date().getFullYear()}{" "}
            <span style={{ fontWeight: 600 }}>Pito Desri Pauzi</span> ·{" "}
            <span style={{ color: "var(--accent)" }}>pitok.my.id</span>
          </p>
        </div>
      </footer>

      <SystemConsole features={content.features} />
      <BiosBoot features={content.features} />
      <CompanionMascot />
    </>
  );
}

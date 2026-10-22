import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Technology } from '@/components/sections/Technology';
import { Process } from '@/components/sections/Process';
import { WorkInMotion } from '@/components/sections/WorkInMotion';
import { Gallery } from '@/components/sections/Gallery';
import { Contact } from '@/components/sections/Contact';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { seo } from '@/data/site';

export default function Home() {
  useDocumentMeta({ title: seo.title, description: seo.description });

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Technology />
      <Process />
      <WorkInMotion />
      <Gallery />
      <Contact />
    </>
  );
}

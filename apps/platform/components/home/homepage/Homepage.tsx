"use client";

import { homepageData } from "./_mocks/homepage-data";
import Hero from "./_components/Hero";
import JoinUs from "./_components/JoinUs";
import About from "./_components/About";
import Testimonials from "./_components/Testimonials";
import Footer from "./_components/Footer";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <Hero
        title={homepageData.hero.title}
        subtitle={homepageData.hero.subtitle}
        description={homepageData.hero.description}
        primaryCTA={homepageData.hero.primaryCTA}
        secondaryCTA={homepageData.hero.secondaryCTA}
      />

      <JoinUs />

      <About
        title={homepageData.about.title}
        subtitle={homepageData.about.subtitle}
        description={homepageData.about.description}
        stats={homepageData.about.stats}
        image={homepageData.about.image}
      />

      <Testimonials
        title={homepageData.testimonials.title}
        subtitle={homepageData.testimonials.subtitle}
        items={homepageData.testimonials.items}
      />

      <Footer />
    </main>
  );
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface CTAButton {
  text: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: CTAButton;
    secondaryCTA: CTAButton;
    backgroundVideo?: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: Feature[];
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    image: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
}

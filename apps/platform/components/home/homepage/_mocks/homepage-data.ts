import { HomepageData } from "../_types/homepage";

export const homepageData: HomepageData = {
  hero: {
    title: "Building the Future of Team Collaboration",
    subtitle: "Join Us on This Journey",
    description:
      "Stacknity is in early development, and we're looking for passionate individuals to help us build something revolutionary. Be part of our story from the beginning and help shape the future of productivity tools.",
    primaryCTA: {
      text: "Join Our Team",
      href: "/contact",
      variant: "primary",
    },
    secondaryCTA: {
      text: "Learn More",
      href: "#about",
      variant: "secondary",
    },
  },
  features: {
    title: "Powerful Features",
    subtitle: "Everything you need to succeed",
    items: [
      {
        id: "1",
        title: "Lightning Fast Deployment",
        description:
          "Deploy your applications in seconds with our optimized CI/CD pipeline and global edge network.",
        icon: "⚡",
        color: "var(--brand-primary)",
      },
      {
        id: "2",
        title: "Scalable Infrastructure",
        description:
          "Auto-scaling infrastructure that grows with your business, handling millions of requests effortlessly.",
        icon: "🚀",
        color: "var(--brand-secondary)",
      },
      {
        id: "3",
        title: "Advanced Analytics",
        description:
          "Real-time insights and detailed analytics to optimize performance and user experience.",
        icon: "📊",
        color: "var(--brand-accent)",
      },
      {
        id: "4",
        title: "Enterprise Security",
        description:
          "Bank-grade security with SOC 2 compliance, end-to-end encryption, and advanced threat protection.",
        icon: "🔒",
        color: "var(--vibrant-coral)",
      },
      {
        id: "5",
        title: "Team Collaboration",
        description:
          "Seamless collaboration tools with real-time editing, code reviews, and project management.",
        icon: "👥",
        color: "var(--bright-lime-green)",
      },
      {
        id: "6",
        title: "24/7 Support",
        description:
          "Expert support team available around the clock to help you succeed with priority assistance.",
        icon: "🛟",
        color: "var(--golden-yellow)",
      },
    ],
  },
  about: {
    title: "Building the Future",
    subtitle: "Early stage startup with big vision",
    description:
      "Stacknity is an ambitious project in its early stages. We're building a platform that will revolutionize team collaboration and productivity. While we're still developing our core features, we have a clear vision and are looking for passionate people to join our journey.",
    stats: [
      { value: "2025", label: "Founded" },
      { value: "30%", label: "MVP Progress" },
      { value: "5+", label: "Core Features" },
      { value: "∞", label: "Potential" },
    ],
    image: "https://picsum.photos/600/400?random=1",
  },
  testimonials: {
    title: "What Our Users Say",
    subtitle: "Trusted by developers worldwide",
    items: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "Lead Developer",
        company: "TechCorp",
        content:
          "Stacknity has revolutionized how we deploy and manage our applications. The speed and reliability are unmatched.",
        avatar: "https://picsum.photos/60/60?random=2",
        rating: 5,
      },
      {
        id: "2",
        name: "Michael Rodriguez",
        role: "DevOps Engineer",
        company: "StartupXYZ",
        content:
          "The infrastructure scaling is seamless. We went from prototype to production without any hiccups.",
        avatar: "https://picsum.photos/60/60?random=3",
        rating: 5,
      },
      {
        id: "3",
        name: "Emily Johnson",
        role: "CTO",
        company: "Innovation Labs",
        content:
          "Best investment we've made for our development workflow. The analytics insights are incredibly valuable.",
        avatar: "https://picsum.photos/60/60?random=4",
        rating: 5,
      },
    ],
  },
};

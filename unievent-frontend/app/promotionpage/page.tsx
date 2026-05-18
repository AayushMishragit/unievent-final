import React from "react";
import {
  ArrowRight,
  Users,
  Sparkles,
  Rocket,
  Trophy,
  CalendarDays,
  Lightbulb,
  Laptop,
  Palette,
  Brain,
  Code2,
  Globe,
  Star,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Quote = string;

interface Benefit {
  title: string;
  icon: LucideIcon;
  desc: string;
}

interface Experience {
  title: string;
  description: string;
}

interface Community {
  name: string;
  icon: LucideIcon;
}

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle: string;
}

interface GlowProps {
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

const quotes: Quote[] = [
  "Great opportunities begin with participation.",
  "Your network starts with one event.",
  "Skills grow where curiosity meets action.",
  "Every successful student once clicked ‘Join Event’.",
];

const benefits: Benefit[] = [
  {
    title: "Discover Campus Events",
    icon: CalendarDays,
    desc: "Explore workshops, tech fests, seminars, and exciting student experiences.",
  },
  {
    title: "Join Student Communities",
    icon: Users,
    desc: "Find your tribe, collaborate with peers, and grow together through communities.",
  },
  {
    title: "Participate in Hackathons",
    icon: Trophy,
    desc: "Compete, innovate, and build impactful ideas that challenge your creativity.",
  },
  {
    title: "Build Leadership Skills",
    icon: Rocket,
    desc: "Learn teamwork, communication, networking, and confidence beyond classrooms.",
  },
  {
    title: "Learn Beyond Academics",
    icon: Lightbulb,
    desc: "Gain practical exposure through collaboration, innovation, and events.",
  },
];

const experiences: Experience[] = [
  {
    title: "Tech Fest Experience",
    description:
      "Explore innovation, robotics, coding battles, and exciting student showcases.",
  },
  {
    title: "Startup Networking",
    description:
      "Meet founders, creators, and future entrepreneurs from your campus ecosystem.",
  },
  {
    title: "Coding Competitions",
    description:
      "Challenge yourself with real-world problem solving and competitive coding.",
  },
  {
    title: "Workshops & Seminars",
    description:
      "Learn directly from industry experts and student mentors through engaging sessions.",
  },
  {
    title: "Cultural Events",
    description:
      "Celebrate creativity, music, performances, and unforgettable campus memories.",
  },
];

const communities: Community[] = [
  {
    name: "Web Development Club",
    icon: Laptop,
  },
  {
    name: "AI & ML Community",
    icon: Brain,
  },
  {
    name: "Design Circle",
    icon: Palette,
  },
  {
    name: "Startup Hub",
    icon: Rocket,
  },
  {
    name: "Coding Society",
    icon: Code2,
  },
];

const timeline: string[] = [
  "Join Event",
  "Meet People",
  "Learn Skills",
  "Build Projects",
  "Grow Career",
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
}) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
        <Sparkles size={16} className="text-violet-400" />
        <span className="text-sm text-gray-300">{badge}</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
        {title}
      </h2>

      <p className="text-gray-400 text-lg leading-relaxed">{subtitle}</p>
    </div>
  );
};

const Glow: React.FC<GlowProps> = ({ className = "" }) => {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                  MAIN PAGE                                 */
/* -------------------------------------------------------------------------- */

const UniEventLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden scroll-smooth">
      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Glow className="w-72 h-72 bg-violet-500 top-10 left-10" />
        <Glow className="w-80 h-80 bg-cyan-500 top-[40%] right-10" />
        <Glow className="w-96 h-96 bg-pink-500 bottom-0 left-1/3" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-400" />
            <h1 className="text-2xl font-bold">UniEvent</h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <a href="#why" className="hover:text-white transition-colors">
              Why UniEvent
            </a>

            <a href="#events" className="hover:text-white transition-colors">
              Experiences
            </a>

            <a
              href="#communities"
              className="hover:text-white transition-colors"
            >
              Communities
            </a>
          </div>

          <button className="px-5 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform">
            Explore
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
              <Sparkles size={16} className="text-violet-400" />

              <span className="text-sm text-gray-300">
                Events • Communities • Innovation
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Build,
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Connect,
              </span>
              <br />
              Explore with UniEvent
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-xl mb-10">
              Discover hackathons, workshops, student clubs, and inspiring
              experiences that help you grow your skills, network, and future.
            </p>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-20 blur-3xl rounded-[40px]" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">
                {[
                  {
                    title: "Hackathons",
                    icon: Trophy,
                  },
                  {
                    title: "Workshops",
                    icon: Lightbulb,
                  },
                  {
                    title: "Communities",
                    icon: Users,
                  },
                  {
                    title: "Innovation",
                    icon: Rocket,
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:-translate-y-2 transition-all duration-300"
                    >
                      <Icon size={34} className="text-violet-400 mb-4" />

                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 p-6">
                <p className="text-lg leading-relaxed text-gray-100">
                  “Your campus experience becomes unforgettable when you start
                  participating.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Motivation"
            title="Fuel Your Student Journey"
            subtitle="Every opportunity begins with one decision to participate."
          />

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:bg-gradient-to-br hover:from-violet-500/20 hover:to-cyan-500/10 hover:-translate-y-2 transition-all duration-500"
              >
                <Star
                  size={28}
                  className="text-yellow-400 mb-6 group-hover:rotate-12 transition-transform"
                />

                <p className="text-lg text-gray-200 leading-relaxed">
                  “{quote}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY UNIevent */}
      <section id="why" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Why UniEvent"
            title="More Than Just Events"
            subtitle="A modern student ecosystem where learning meets collaboration and innovation."
          />

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-violet-400/30 hover:-translate-y-3 transition-all duration-500"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                      <Icon size={30} />
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section
        id="events"
        className="py-28 px-6 bg-gradient-to-b from-transparent to-white/[0.03]"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Experiences"
            title="Featured Campus Experiences"
            subtitle="Explore activities designed to inspire creativity, networking, and innovation."
          />

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 hover:scale-[1.03] transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                      <Globe className="text-cyan-400" />
                    </div>

                    <h3 className="text-3xl font-bold mb-4 leading-snug">
                      {exp.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>

                  <button className="mt-8 flex items-center gap-2 text-violet-400 font-semibold group-hover:gap-4 transition-all">
                    Explore Experience
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            badge="Growth Journey"
            title="Your Student Growth Timeline"
            subtitle="Every successful journey starts with participation and curiosity."
          />

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-500" />

            <div className="grid md:grid-cols-5 gap-10 relative">
              {timeline.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold shadow-2xl shadow-violet-500/30">
                    {index + 1}
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{step}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITIES */}
      <section id="communities" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Communities"
            title="Find Your Community"
            subtitle="Connect with ambitious students who share your interests and passions."
          />

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
            {communities.map((community, index) => {
              const Icon = community.icon;

              return (
                <div
                  key={index}
                  className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:-translate-y-3 hover:bg-gradient-to-b hover:from-violet-500/20 hover:to-cyan-500/10 transition-all duration-500"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-semibold">{community.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 p-14 md:p-24 text-center shadow-2xl">
          <div className="absolute inset-0 backdrop-blur-xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
              Your Next Opportunity
              <br />
              Might Be One Event Away.
            </h2>

            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed">
              Discover communities, attend inspiring events, and unlock
              experiences that shape your future.
            </p>

            <button className="px-10 py-5 rounded-2xl bg-black text-white font-semibold text-lg hover:scale-105 transition-transform shadow-2xl">
              Start Exploring
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
    </div>
  );
};

export default UniEventLandingPage;

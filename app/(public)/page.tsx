import HeroSection from '@/components/Home/HeroSection';
import AboutSection from '@/components/Home/AboutSection';
import FeatureSection from '@/components/Home/FeatureSection';
import HowItWorks from '@/components/Home/HowItWorks';
import TestimonialSection from '@/components/Home/TestimonialSection';
import CTASection from '@/components/Home/CTASection';

export default function Home() {
  return (
    <main className="min-h-[90vh] bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeatureSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Final CTA Section */}
      <CTASection />
    </main>
  );
}

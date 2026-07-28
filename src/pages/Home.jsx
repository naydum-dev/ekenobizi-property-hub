import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaHome,
  FaKey,
  FaStore,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

const categories = [
  {
    title: "Land for Sale",
    description: "Plots and parcels across Ekenobizi villages.",
    icon: FaMapMarkedAlt,
    href: "/listings",
  },
  {
    title: "House for Sale",
    description: "Family homes and residential properties.",
    icon: FaHome,
    href: "/listings",
  },
  {
    title: "House for Rent",
    description: "Affordable rentals within the community.",
    icon: FaKey,
    href: "/listings",
  },
  {
    title: "Shop for Rent",
    description: "Commercial spaces for trade and business.",
    icon: FaStore,
    href: "/listings",
  },
];

const steps = [
  {
    number: "01",
    title: "Browse Listings",
    description:
      "Search by category or village. Every listing you see has already passed admin review.",
  },
  {
    number: "02",
    title: "Contact the Owner",
    description:
      "Reach the property owner directly via WhatsApp. No middlemen. No hidden fees.",
  },
  {
    number: "03",
    title: "Visit and Verify",
    description:
      "Inspect the property in person. Our verification badge tells you what we have already confirmed.",
  },
];

const trustPoints = [
  {
    icon: FaShieldAlt,
    title: "Every Listing is Reviewed",
    description:
      "No listing goes live without passing through our admin review process. What you see has been checked.",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Built for This Community",
    description:
      "We serve Ekenobizi and Ekenobizi alone. This is not a generic portal — it is your community platform.",
  },
  {
    icon: FaCheckCircle,
    title: "Verified Badge",
    description:
      "Listings that have been physically confirmed carry a Verified badge. Look for it before you contact an owner.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const listPropertyLink = user ? "/owner/submit" : "/register";
  return (
    <main>
      <SEO
        title="Verified Property Listings in Ekenobizi"
        description="Find land, houses, and shops for sale or rent in Ekenobizi Community, Umuahia South LGA. Every listing reviewed by a human admin before it goes live."
      />

      {/* ── HERO ── */}
      <section className="bg-brand-green-deep text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-4">
            Ekenobizi Community · Umuahia South LGA
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Find Property You Can Trust <br className="hidden md:block" />
            In Ekenobizi
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Every listing on this platform is human-reviewed and verified before
            it goes live. No scams. No surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/listings"
              className="bg-brand-gold text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition"
            >
              Browse Listings
            </Link>
            <Link
              to={listPropertyLink}
              className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-brand-green-deep transition"
            >
              List Your Property
            </Link>
          </div>

          <p className="mt-12 text-gray-400 text-sm tracking-wide">
            Serving · Dikeukwu · Dikenta · Azumiri · Umuzam · Umunobiukwu
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-green-deep mb-3">
              What Are You Looking For?
            </h2>
            <p className="text-gray-500 text-lg">
              Browse by property type across the Ekenobizi Community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  to={cat.href}
                  className="group border border-gray-200 rounded-xl p-6 text-center hover:border-brand-green hover:shadow-md transition"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="text-4xl text-brand-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-green-deep mb-2 group-hover:text-brand-green transition">
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-green-deep mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg">
              Finding trusted property in Ekenobizi is straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-5xl font-bold text-brand-gold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-brand-green-deep mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNAL ── */}
      <section className="bg-brand-green-deep text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Why Ekenobizi Property Hub?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Property transactions in our community deserve more than a generic
              listing site. They deserve a platform built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="bg-white/10 rounded-xl p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="text-4xl text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-green-deep mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Whether you are looking for property or ready to list one — your
            community platform is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/listings"
              className="bg-brand-green-deep text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition"
            >
              Browse Listings
            </Link>
            <Link
              to={listPropertyLink}
              className="border border-brand-green-deep text-brand-green-deep font-semibold px-8 py-3 rounded-lg hover:bg-brand-green-deep hover:text-white transition"
            >
              List Your Property
            </Link>
          </div>

          <p className="mt-10 text-sm text-gray-400 italic">
            "Your Community. Your Property. Your Trust."
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;

export default function Footer() {
  return (
    <footer className="bg-brand-green-deep text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div>
            <p className="text-brand-gold font-semibold text-lg">
              Ekenobizi Property Hub
            </p>
            <p className="text-sm text-white/70 mt-1 italic">
              Your Community. Your Property. Your Trust.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <a href="/" className="hover:text-brand-gold transition-colors">
              Home
            </a>
            <a
              href="/listings"
              className="hover:text-brand-gold transition-colors"
            >
              Browse Listings
            </a>
            <a
              href="/register"
              className="hover:text-brand-gold transition-colors"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="hover:text-brand-gold transition-colors"
            >
              Sign In
            </a>
          </div>

          {/* Community note */}
          <div className="text-sm text-white/60 max-w-xs">
            <p>
              Serving the Ekenobizi Community,
              <br />
              Umuahia South LGA, Abia State.
            </p>
            <p className="mt-2">
              All listings are human-reviewed before going live.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40 text-center">
          © {new Date().getFullYear()} Ekenobizi Property Hub. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

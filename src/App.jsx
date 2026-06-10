import { supabase } from "./lib/supabase";

function App() {
  supabase
    .from("_test")
    .select("*")
    .then(({ error }) => {
      if (error) {
        console.log(
          "Supabase connected ✅ (table does not exist yet, that is fine)",
        );
      }
    });

  return (
    <div className="min-h-screen bg-brand-green-deep flex items-center justify-center">
      <h1 className="text-brand-gold text-3xl font-bold">Supabase Connected</h1>
    </div>
  );
}

export default App;

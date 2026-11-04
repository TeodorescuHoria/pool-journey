import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="py-24 text-center">
        <h1 className="text-4xl font-extrabold">Te-ai rătăcit pe munte</h1>
        <p className="mt-2 text-muted-foreground">Pagina nu există.</p>
        <Link to="/" className={buttonVariants({ className: "mt-6" })}>
          Înapoi la tabăra de bază
        </Link>
      </div>
    </Layout>
  );
}

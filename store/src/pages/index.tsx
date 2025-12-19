import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login on mount
    router.push("/login");
  }, [router]);

  return null;
}

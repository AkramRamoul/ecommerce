import { Button } from "@payloadcms/ui";
import Link from "next/link";

export default function StripeVerify() {
  return (
    <Link href="/stripe-verify">
      <Button>Verify Account</Button>
    </Link>
  );
}

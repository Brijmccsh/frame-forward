import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NonprofitRequests } from "@/components/requests/nonprofit-requests";
import { requireProfile } from "@/lib/auth";
import {
  listRequestsForNonprofit,
  listSavedPhotos,
} from "@/lib/queries/requests";
import { getHoursPerPhoto } from "@/lib/queries/settings";

export const metadata: Metadata = { title: "My requests" };

export default async function RequestsPage() {
  const session = await requireProfile();
  // Photographers have their own view of the same relationship.
  if (session.role === "photographer") redirect("/app/requests");

  const [requests, saved, hoursPerPhoto] = await Promise.all([
    listRequestsForNonprofit(session.profile.id),
    listSavedPhotos(session.profile.id),
    getHoursPerPhoto(),
  ]);

  const confirmed = requests.filter((request) => request.status === "used");

  return (
    <>
      <h1 className="font-head text-3xl font-bold text-text sm:text-4xl">
        My requests
      </h1>
      <p className="mt-2 max-w-prose text-pretty text-muted">
        Photos you&apos;ve asked to use, and the ones you&apos;ve confirmed.
        Confirming is what credits a photographer&apos;s service hours — it
        takes two clicks and means a lot.
      </p>

      {confirmed.length ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-pill border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent-ink">
          <Sparkles aria-hidden className="h-4 w-4" />
          You&apos;ve credited{" "}
          {confirmed.reduce(
            (total, request) => total + Number(request.hours_awarded ?? 0),
            0,
          )}{" "}
          hours to student photographers
        </p>
      ) : null}

      <div className="mt-8">
        <NonprofitRequests
          requests={requests}
          saved={saved}
          hoursPerPhoto={hoursPerPhoto}
        />
      </div>
    </>
  );
}

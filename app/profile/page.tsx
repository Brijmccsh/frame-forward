import type { Metadata } from "next";
import { SignedInShell } from "@/components/layout/signed-in-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PhotographerForm } from "@/components/profile/photographer-form";
import { NonprofitForm } from "@/components/profile/nonprofit-form";
import { ButtonLink } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Your profile" };

export default async function ProfilePage() {
  const session = await requireProfile();
  const { role, profile } = session;
  const name = role === "photographer" ? profile.name : profile.org_name;

  return (
    <SignedInShell>
      <ProfileHeader
        role={role}
        name={name}
        tagline={role === "photographer" ? profile.tagline : profile.mission}
        avatarUrl={profile.avatar_url}
        coverUrl={profile.cover_url}
        location={profile.location}
        verified={role === "nonprofit" ? profile.verified : false}
        actions={
          <ButtonLink href={`/u/${profile.id}`} variant="outline" size="sm">
            View public profile
          </ButtonLink>
        }
      />

      <div className="mt-10">
        <h2 className="font-head text-xl font-semibold text-text">
          Edit your profile
        </h2>
        <p className="mt-1 text-sm text-muted">
          Changes save straight away and show up everywhere on Frame Forward.
        </p>

        <div className="mt-6">
          {role === "photographer" ? (
            <PhotographerForm
              userId={profile.id}
              mode="edit"
              profile={profile}
            />
          ) : (
            <NonprofitForm userId={profile.id} mode="edit" profile={profile} />
          )}
        </div>
      </div>
    </SignedInShell>
  );
}

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { FieldRow, FormSection } from "./form-section";
import {
  createPhotographerProfile,
  updatePhotographerProfile,
} from "@/lib/profiles/actions";
import type { PhotographerInput } from "@/lib/profiles/types";
import type { Photographer } from "@/lib/types";

const empty: PhotographerInput = {
  name: "",
  avatar_url: null,
  cover_url: null,
  tagline: null,
  bio: null,
  school: null,
  grad_year: "",
  location: null,
  website: null,
  instagram: null,
};

function fromRow(row: Photographer): PhotographerInput {
  return {
    name: row.name ?? "",
    avatar_url: row.avatar_url,
    cover_url: row.cover_url,
    tagline: row.tagline,
    bio: row.bio,
    school: row.school,
    grad_year: row.grad_year ?? "",
    location: row.location,
    website: row.website,
    instagram: row.instagram,
  };
}

export function PhotographerForm({
  userId,
  mode,
  profile,
}: {
  userId: string;
  mode: "create" | "edit";
  profile?: Photographer;
}) {
  const { success } = useToast();
  const [values, setValues] = React.useState<PhotographerInput>(
    profile ? fromRow(profile) : empty,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [errorField, setErrorField] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const set = <K extends keyof PhotographerInput>(
    key: K,
    value: PhotographerInput[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const text = (key: keyof PhotographerInput) =>
    (values[key] as string | null) ?? "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setErrorField(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPhotographerProfile(values)
          : await updatePhotographerProfile(values);

      // Create redirects on success, so a result here means either an edit
      // succeeded or something failed.
      if (!result) return;
      if (!result.ok) {
        setError(result.error);
        setErrorField(result.field ?? null);
        return;
      }
      success("Profile saved", "Your changes are live.");
    });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <FormSection
          title="Your look"
          description="A face and a banner make your profile feel like yours."
        >
          <ImageUploader
            label="Cover banner"
            hint="Wide shot, 1600×540 or similar. Optional."
            bucket="covers"
            userId={userId}
            shape="cover"
            value={values.cover_url}
            onChange={(url) => set("cover_url", url)}
            disabled={pending}
          />
          <ImageUploader
            label="Profile photo"
            hint="A square image works best. Optional."
            bucket="avatars"
            userId={userId}
            shape="avatar"
            rounded="full"
            value={values.avatar_url}
            onChange={(url) => set("avatar_url", url)}
            disabled={pending}
          />
        </FormSection>

        <FormSection title="About you">
          <Input
            label="Name"
            required
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Maya Chen"
            autoComplete="name"
            maxLength={80}
            error={errorField === "name" ? error ?? undefined : undefined}
            disabled={pending}
          />
          <Input
            label="Tagline"
            hint="One line about what you shoot."
            value={text("tagline")}
            onChange={(event) => set("tagline", event.target.value)}
            placeholder="Golden-hour portraits & street scenes"
            maxLength={120}
            disabled={pending}
          />
          <Textarea
            label="Bio"
            value={text("bio")}
            onChange={(event) => set("bio", event.target.value)}
            placeholder="Tell nonprofits a little about you and the work you love making."
            maxLength={1000}
            showCount
            rows={5}
            disabled={pending}
          />
          <FieldRow>
            <Input
              label="School"
              value={text("school")}
              onChange={(event) => set("school", event.target.value)}
              placeholder="Lincoln High School"
              maxLength={120}
              disabled={pending}
            />
            <Input
              label="Graduation year"
              type="number"
              inputMode="numeric"
              min={1950}
              max={new Date().getFullYear() + 10}
              value={String(values.grad_year ?? "")}
              onChange={(event) => set("grad_year", event.target.value)}
              placeholder="2027"
              disabled={pending}
            />
          </FieldRow>
          <Input
            label="Location"
            value={text("location")}
            onChange={(event) => set("location", event.target.value)}
            placeholder="Portland, OR"
            maxLength={120}
            disabled={pending}
          />
        </FormSection>

        <FormSection title="Where else to find you">
          <FieldRow>
            <Input
              label="Website"
              type="url"
              value={text("website")}
              onChange={(event) => set("website", event.target.value)}
              placeholder="mayachen.com"
              disabled={pending}
            />
            <Input
              label="Instagram"
              value={text("instagram")}
              onChange={(event) => set("instagram", event.target.value)}
              placeholder="@mayashoots"
              leading={<span className="text-sm">@</span>}
              disabled={pending}
            />
          </FieldRow>
        </FormSection>
      </Card>

      {error && !errorField ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" loading={pending}>
          {mode === "create" ? "Create my profile" : "Save changes"}
        </Button>
        {mode === "create" ? (
          <p className="text-xs text-muted">
            You can change any of this later.
          </p>
        ) : null}
      </div>
    </form>
  );
}

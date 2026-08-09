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
  createNonprofitProfile,
  updateNonprofitProfile,
} from "@/lib/profiles/actions";
import type { NonprofitInput } from "@/lib/profiles/types";
import type { Nonprofit } from "@/lib/types";

const empty: NonprofitInput = {
  org_name: "",
  avatar_url: null,
  cover_url: null,
  mission: null,
  contact_name: null,
  website: null,
  location: null,
  ein: null,
};

function fromRow(row: Nonprofit): NonprofitInput {
  return {
    org_name: row.org_name ?? "",
    avatar_url: row.avatar_url,
    cover_url: row.cover_url,
    mission: row.mission,
    contact_name: row.contact_name,
    website: row.website,
    location: row.location,
    ein: row.ein,
  };
}

export function NonprofitForm({
  userId,
  mode,
  profile,
}: {
  userId: string;
  mode: "create" | "edit";
  profile?: Nonprofit;
}) {
  const { success } = useToast();
  const [values, setValues] = React.useState<NonprofitInput>(
    profile ? fromRow(profile) : empty,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [errorField, setErrorField] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const set = <K extends keyof NonprofitInput>(
    key: K,
    value: NonprofitInput[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const text = (key: keyof NonprofitInput) =>
    (values[key] as string | null) ?? "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setErrorField(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createNonprofitProfile(values)
          : await updateNonprofitProfile(values);

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
          title="Your org's look"
          description="Photographers see this when you request their work."
        >
          <ImageUploader
            label="Cover banner"
            hint="A wide photo of your work or team. Optional."
            bucket="covers"
            userId={userId}
            shape="cover"
            value={values.cover_url}
            onChange={(url) => set("cover_url", url)}
            disabled={pending}
          />
          <ImageUploader
            label="Logo"
            hint="Square logo, PNG with transparency looks great. Optional."
            bucket="avatars"
            userId={userId}
            shape="avatar"
            rounded="md"
            value={values.avatar_url}
            onChange={(url) => set("avatar_url", url)}
            disabled={pending}
          />
        </FormSection>

        <FormSection title="About your organization">
          <Input
            label="Organization name"
            required
            value={values.org_name}
            onChange={(event) => set("org_name", event.target.value)}
            placeholder="Riverside Food Bank"
            maxLength={80}
            error={errorField === "org_name" ? error ?? undefined : undefined}
            disabled={pending}
          />
          <Textarea
            label="Mission"
            hint="What you do, and who it's for."
            value={text("mission")}
            onChange={(event) => set("mission", event.target.value)}
            placeholder="We get fresh food to families across the river district."
            maxLength={1000}
            showCount
            rows={5}
            disabled={pending}
          />
          <FieldRow>
            <Input
              label="Contact name"
              value={text("contact_name")}
              onChange={(event) => set("contact_name", event.target.value)}
              placeholder="Dana Ruiz"
              autoComplete="name"
              maxLength={80}
              disabled={pending}
            />
            <Input
              label="Location"
              value={text("location")}
              onChange={(event) => set("location", event.target.value)}
              placeholder="Riverside, CA"
              maxLength={120}
              disabled={pending}
            />
          </FieldRow>
          <FieldRow>
            <Input
              label="Website"
              type="url"
              value={text("website")}
              onChange={(event) => set("website", event.target.value)}
              placeholder="riversidefoodbank.org"
              disabled={pending}
            />
            <Input
              label="EIN"
              hint="Your tax ID, if you have one handy."
              value={text("ein")}
              onChange={(event) => set("ein", event.target.value)}
              placeholder="12-3456789"
              maxLength={20}
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
          {mode === "create" ? "Create our profile" : "Save changes"}
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

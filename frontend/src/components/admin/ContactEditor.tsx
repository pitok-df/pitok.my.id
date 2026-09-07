"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useContact, useUpdateContact } from "@/hooks/queries/useContact";

export function ContactEditor() {
  const { data: contact, isLoading } = useContact();
  const updateContact = useUpdateContact();

  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [email, setEmail] = useState("");
  const [initialized, setInitialized] = useState(false);

  const data = contact as Record<string, unknown> | undefined;

  if (data && !initialized) {
    setHeading(String(data.heading || ""));
    setSubheading(String(data.subheading || ""));
    setEmail(String(data.email || ""));
    setInitialized(true);
  }

  const handleSave = () => {
    updateContact.mutate({
      heading,
      subheading,
      email: email || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-heading">Heading</Label>
            <Input
              id="contact-heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Get in Touch"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-subheading">Subheading</Label>
            <Input
              id="contact-subheading"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="I'd love to hear from you..."
            />
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateContact.isPending}>
          {updateContact.isPending && (
            <Loader2 className="size-3 animate-spin" />
          )}
          Save Contact
        </Button>
      </div>
    </div>
  );
}

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { getAboutPage } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

export default async function AboutPage() {
  const data = await getAboutPage().catch(() => null);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Who we are"
            title="About Liberty Life Perth"
            subtitle="We're a family church in Perth, Western Australia — a place where everyone belongs."
          />
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-white mb-6">
            {data?.mission?.title ?? "Our Mission"}
          </h2>
          {data?.mission?.body ? (
            <div className="prose prose-invert max-w-none [&_p]:text-white/70 [&_p]:leading-relaxed">
              <PortableText value={data.mission.body} />
            </div>
          ) : (
            <p className="text-white/60 leading-relaxed">
              Add your mission statement in Studio under Pages → mission.
            </p>
          )}
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-20 bg-navy-dark border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-white mb-6">
            {data?.vision?.title ?? "Our Vision"}
          </h2>
          {data?.vision?.body ? (
            <div className="prose prose-invert max-w-none [&_p]:text-white/70 [&_p]:leading-relaxed">
              <PortableText value={data.vision.body} />
            </div>
          ) : (
            <p className="text-white/60 leading-relaxed">
              Add your vision statement in Studio under Pages → vision.
            </p>
          )}
        </div>
      </section>

      {/* Meet the team */}
      {data?.staff?.length > 0 && (
        <section className="py-16 md:py-20 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <SectionHeader eyebrow="Our people" title="Meet the team" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.staff.map((member: { _id: string; name: string; role: string; photo?: object; bio?: string }) => (
                <div key={member._id} className="flex flex-col gap-4">
                  {member.photo && (
                    <div className="aspect-square rounded-2xl overflow-hidden bg-navy-dark relative">
                      <Image
                        src={urlFor(member.photo).width(400).height(400).url()}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-xl text-white">{member.name}</h3>
                    <p className="text-sm text-rosegold mb-2">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-white/60 leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl md:text-4xl text-white">Join us this Sunday</h2>
          <p className="text-white/60">We meet every Sunday at 10:00 AM in Perth. We&apos;d love to see you there.</p>
          <Button href="/contact" size="lg">Plan a visit</Button>
        </div>
      </section>
    </div>
  );
}

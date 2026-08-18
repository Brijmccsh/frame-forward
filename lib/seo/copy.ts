/**
 * Intro copy for each public category page.
 *
 * Category pages exist to rank, and a page that is nothing but a photo grid is
 * a "thin page" that search engines largely ignore. Each entry gives the page
 * something to actually be about, in the product's own voice.
 *
 * Unknown slugs fall back to generated copy, so a category added in the
 * database is never broken — it just reads more generically until someone
 * writes for it.
 */
export interface CategoryCopy {
  heading: string;
  intro: string;
  forNonprofits: string;
}

const COPY: Record<string, CategoryCopy> = {
  "nature-landscapes": {
    heading: "Nature & landscape photography, free for nonprofits",
    intro:
      "Coastlines, forests, open country and the quiet places in between — shot by student photographers who know the ground they are standing on.",
    forNonprofits:
      "Land trusts, parks groups and conservation charities use landscape imagery for annual reports, grant applications and campaign pages.",
  },
  wildlife: {
    heading: "Wildlife photography, free for nonprofits",
    intro:
      "Birds, mammals and the patient work of waiting for them. Wildlife photography takes hours in the cold for a few good frames, and these students put in those hours.",
    forNonprofits:
      "Wildlife and habitat organisations rarely have a photo budget. This is imagery of real animals in real places, free to use.",
  },
  "flowers-plants": {
    heading: "Flower & plant photography, free for nonprofits",
    intro:
      "Gardens, wildflowers, seasonal growth and close detail — the small subjects that carry a lot of feeling.",
    forNonprofits:
      "Community gardens, botanical groups and environmental programmes use plant photography for newsletters, signage and seasonal appeals.",
  },
  travel: {
    heading: "Travel photography, free for nonprofits",
    intro:
      "Places as students actually find them: a street in another country, a long road, somewhere worth remembering.",
    forNonprofits:
      "Useful for organisations telling stories that cross borders, or that need a sense of place without stock-photo gloss.",
  },
  "people-portraits": {
    heading: "Portrait photography, free for nonprofits",
    intro:
      "Faces photographed with care. Portraits are the hardest thing to fake and the fastest way to make a mission feel like it belongs to someone.",
    forNonprofits:
      "Every photograph here is shared willingly by the photographer. Always confirm consent with anyone recognisable before publishing.",
  },
  "community-events": {
    heading: "Community & event photography, free for nonprofits",
    intro:
      "Gatherings, fundraisers, markets and the ordinary work of people showing up for each other.",
    forNonprofits:
      "The imagery that makes an impact report feel like a real place rather than a stock library.",
  },
  "urban-architecture": {
    heading: "Urban & architecture photography, free for nonprofits",
    intro:
      "Buildings, bridges, transit and the shape of a city — form, line and light.",
    forNonprofits:
      "Housing, planning and civic organisations use architectural imagery for reports and policy work.",
  },
  "animals-pets": {
    heading: "Pet & animal photography, free for nonprofits",
    intro:
      "Dogs, cats and the animals people love, photographed by students who clearly love them too.",
    forNonprofits:
      "Shelters and rescues run on adoption appeals and fundraising, both of which live or die on the photograph.",
  },
  "action-sports": {
    heading: "Sports & action photography, free for nonprofits",
    intro:
      "Games, meets and movement caught at the right hundredth of a second.",
    forNonprofits:
      "Youth sports charities and after-school programmes use action imagery for recruitment and funding.",
  },
  "food-culture": {
    heading: "Food & culture photography, free for nonprofits",
    intro:
      "Meals, markets, festivals and traditions — culture as it is actually lived and eaten.",
    forNonprofits:
      "Food banks, kitchens and cultural organisations use this for campaigns, cookbooks and donor updates.",
  },
  "fine-art": {
    heading: "Black & white and fine art photography, free for nonprofits",
    intro:
      "Work made because the photographer wanted to make it. Monochrome, abstract and everything that is more about seeing than recording.",
    forNonprofits:
      "Arts organisations and anyone wanting a cover image with weight to it.",
  },
  "environmental-conservation": {
    heading: "Environmental & conservation photography, free for nonprofits",
    intro:
      "Climate, habitat, restoration and damage. Photographs that document what is changing and what is being protected.",
    forNonprofits:
      "Built for exactly this: conservation reports, advocacy campaigns and funding applications that need real evidence.",
  },
  "volunteering-service": {
    heading: "Volunteering & service photography, free for nonprofits",
    intro:
      "People doing the work — building, planting, serving, cleaning up. Unglamorous and the most useful imagery a charity can have.",
    forNonprofits:
      "Recruitment, thank-you campaigns and annual reports all need pictures of volunteers who look like volunteers.",
  },
  "astrophotography-night": {
    heading: "Astrophotography & night photography, free for nonprofits",
    intro:
      "Night skies, star trails and long exposures. Technically demanding work, and students are often the ones with the patience for it.",
    forNonprofits:
      "Dark-sky groups, observatories and science education programmes.",
  },
  "street-documentary": {
    heading: "Street & documentary photography, free for nonprofits",
    intro:
      "Unposed, unstaged, real. Documentary photography is the closest thing to honest that a picture gets.",
    forNonprofits:
      "When a campaign needs to look like life rather than a photoshoot.",
  },
  "music-performance": {
    heading: "Music & performance photography, free for nonprofits",
    intro:
      "Concerts, theatre, dance and rehearsal rooms — difficult light and one chance to get the moment.",
    forNonprofits:
      "Arts charities, youth music programmes and venues promoting what they do.",
  },
  "education-youth": {
    heading: "Education & youth photography, free for nonprofits",
    intro:
      "Classrooms, tutoring, mentoring and learning as it actually looks — often photographed by students inside their own schools.",
    forNonprofits:
      "Education charities need imagery of real young people learning. Always confirm safeguarding consent before publishing photographs of minors.",
  },
  "health-wellbeing": {
    heading: "Health & wellbeing photography, free for nonprofits",
    intro:
      "Care, movement, rest and recovery. Health imagery that is calm rather than clinical.",
    forNonprofits:
      "Clinics, mental-health campaigns and community wellbeing programmes.",
  },
  "something-else": {
    heading: "Everything else",
    intro:
      "Work that did not fit neatly anywhere — often the most interesting corner of any library.",
    forNonprofits:
      "Worth a look when nothing in the obvious categories is right.",
  },
};

export function categoryCopy(slug: string, name: string): CategoryCopy {
  return (
    COPY[slug] ?? {
      heading: `${name} photography, free for nonprofits`,
      intro: `${name} photographs shared by student photographers for nonprofits to use at no cost.`,
      forNonprofits:
        "Free to use. Request a photo and the photographer hears from you directly.",
    }
  );
}

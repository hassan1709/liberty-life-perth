export type PCEvent = {
  id: string;
  type: "Event";
  attributes: {
    name: string;
    summary: string | null;
    description: string | null;
    starts_at: string;
    ends_at: string;
    location: string | null;
    registration_url: string | null;
    image_url: string | null;
    featured: boolean;
    visible_in_church_center: boolean;
  };
};

export type PCEventsResponse = {
  data: PCEvent[];
  meta: {
    total_count: number;
    count: number;
  };
};

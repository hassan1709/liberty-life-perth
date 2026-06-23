export type PCEvent = {
  id: string;
  type: "EventInstance";
  attributes: {
    name: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    location: string | null;
    registration_url: string | null;
    image_url: string | null;
    all_day_event: boolean;
    church_center_url: string | null;
    recurrence: string | null;
    compact_recurrence_description: string | null;
  };
};

export type PCEventsResponse = {
  data: PCEvent[];
  meta: {
    total_count: number;
    count: number;
  };
};

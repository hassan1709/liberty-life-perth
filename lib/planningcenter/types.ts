export type PCTag = {
  id: string;
  type: "Tag";
  attributes: {
    name: string;
    color: string;
  };
};

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
  relationships: {
    tags: {
      data: Array<{ type: "Tag"; id: string }>;
    };
  };
};

export type PCEventsResponse = {
  data: PCEvent[];
  included: PCTag[];
  meta: {
    total_count: number;
    count: number;
  };
};

export type PCEventWithTags = PCEvent & { tags: string[] };

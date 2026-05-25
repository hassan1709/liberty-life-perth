import SermonCard from "./SermonCard";

type Sermon = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  scripture?: string;
  speaker?: { name: string; role: string };
  series?: { title: string; slug: { current: string }; artwork?: object };
  youtubeUrl: string;
};

export default function SermonGrid({ sermons }: { sermons: Sermon[] }) {
  if (!sermons.length) {
    return (
      <p className="text-white/50 text-center py-16">No sermons found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon._id} sermon={sermon} />
      ))}
    </div>
  );
}

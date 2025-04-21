import MomentWriter from "../components/momentWindow/MomentWriter";
import MomentsHistory from "../components/momentWindow/MomentsHistory";

const MomentsPage = () => {
  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Post a moment */}
          <MomentWriter />
          {/* Moment List */}
          <MomentsHistory />
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;

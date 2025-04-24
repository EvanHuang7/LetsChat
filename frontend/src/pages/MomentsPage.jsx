import { useParams } from "react-router-dom";

import MomentWriter from "../components/moments/MomentWriter";
import MomentsHistory from "../components/moments/MomentsHistory";

const MomentsPage = () => {
  const { id } = useParams();
  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-8">
          {/* Post a moment */}
          {id === "all" && <MomentWriter />}
          {/* Moment List */}
          <MomentsHistory />
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;

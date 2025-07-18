import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id),
    getLatestInterviews({ userId: user?.id }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-center">Interview generation</h3>

      <Agent
        userName={user?.name ?? "Guest"}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
    </div>
  );
};

export default Page;

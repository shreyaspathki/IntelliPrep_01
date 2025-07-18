import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-4 justify-between items-center max-sm:flex-col max-sm:items-start">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={50}
              height={50}
              className="rounded-full object-cover size-[50px]"
            />
            <h3 className="text-2xl font-semibold capitalize text-primary-100">
              {interview.role} Interview
            </h3>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <DisplayTechIcons techStack={interview.techstack} />

            <span className="bg-dark-200 px-4 py-2 rounded-lg text-sm font-medium text-primary-200">
              {interview.type}
            </span>
          </div>
        </div>
      </div>

      <Agent
        userName={user?.name || ""}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </div>
  );
};

export default InterviewDetails;

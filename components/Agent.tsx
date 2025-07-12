"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [callStartTime, setCallStartTime] = useState<number | null>(null);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setCallStartTime(Date.now());
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.log("Error:", error);
      setCallStatus(CallStatus.INACTIVE);

      // Handle specific VAPI errors
      if (error?.error?.type === "no-room") {
        console.log("VAPI room was deleted or ended");
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setLastMessage(messages[messages.length - 1].content);
  //   }
  //   console.log("[Debug] Last Message Content:", messages[messages.length - 1].content);

  //   const handleGenerateFeedback = async (messages: SavedMessage[]) => {
  //     console.log("handleGenerateFeedback");

  //     const { success, feedbackId: id } = await createFeedback({
  //       interviewId: interviewId!,
  //       userId: userId!,
  //       transcript: messages,
  //       feedbackId,
  //     });

  //     if (success && id) {
  //       router.push(`/interview/${interviewId}/feedback`);
  //     } else {
  //       console.log("Error saving feedback");
  //       router.push("/");
  //     }
  //   };

  //   const handleGenerateInterview = async () => {
  //     // Parse messages to extract interview data
  //     const lastMessage = messages[messages.length - 1];
  //     console.log("[Debug] Last Message Content:", lastMessage);
  //     if (lastMessage && lastMessage.content.includes("INTERVIEW_DATA:")) {
  //       try {
  //         const dataMatch = lastMessage.content.match(
  //           /INTERVIEW_DATA:\s*(\{[\s\S]*\})/
  //         );
  //         if (dataMatch) {
  //           const interviewData = JSON.parse(dataMatch[1]);

  //           // Make API call to create interview
  //           const response = await fetch("/api/vapi/generate", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               ...interviewData,
  //               userid: userId,
  //             }),
  //           });

  //           if (response.ok) {
  //             console.log("Interview created successfully");
  //           } else {
  //             console.error("Failed to create interview");
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error parsing interview data:", error);
  //       }
  //     }

  //     // Redirect to dashboard with a refresh parameter
  //     router.push("/?refresh=true");
  //   };

  //   if (callStatus === CallStatus.FINISHED) {
  //     if (type === "generate") {
  //       handleGenerateInterview();
  //     } else {
  //       handleGenerateFeedback(messages);
  //     }
  //   }
  // }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  useEffect(() => {
    console.log("[Debug] CallStatus:", callStatus, "Type:", type);

    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      setLastMessage(lastMsg.content);

      console.log("[Debug] Last Message Content:", lastMsg.content);

      const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log("handleGenerateFeedback");

        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        if (success && id) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.log("Error saving feedback");
          router.push("/");
        }
      };

      const handleGenerateInterview = async () => {
        const lastMessage = messages[messages.length - 1];
        console.log("[Debug] RAW Last Message:", lastMessage.content);

        const relevantMessages = messages
          .slice(-6)
          .map((m) => m.content)
          .join(" ");
        console.log("[Debug] Combined Final:", relevantMessages);

        // Try to find INTERVIEW_DATA in the last message
        if (lastMessage && lastMessage.content.includes("INTERVIEW_DATA:")) {
          console.log("[Debug] Found INTERVIEW_DATA in message");
          try {
            const dataMatch = lastMessage.content.match(
              /INTERVIEW_DATA:\s*(\{[\s\S]*\})/
            );
            if (dataMatch) {
              console.log("[Debug] Regex match found:", dataMatch[1]);
              const interviewData = JSON.parse(dataMatch[1]);
              console.log("[Debug] Parsed interview data:", interviewData);

              // Make API call to create interview
              const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...interviewData,
                  userid: userId,
                }),
              });

              if (response.ok) {
                const result = await response.json();
                console.log("Interview created successfully:", result);
                router.push("/?refresh=true");
                return;
              } else {
                const errorData = await response.json();
                console.error("Failed to create interview:", errorData);
              }
            }
          } catch (error) {
            console.error("Error parsing interview data:", error);
          }
        }

        // If we couldn't parse the data, try to extract from the conversation
        console.log("[Debug] Trying to extract data from conversation...");
        const conversation = messages.map((m) => m.content).join(" ");
        console.log("[Debug] Full conversation:", conversation);

        // Look for patterns in the conversation to extract interview data
        // Based on the debug output, the bot is saying: "Interview data, type, mixed, role, front end developer, level, junior, tech stack, JavaScript, amount, 5."
        // Let's create a simple pattern to extract this
        console.log(
          "[Debug] Trying to match pattern in last message:",
          lastMessage.content
        );

        // Try to match in the last message first
        let simplePattern = lastMessage.content.match(
          /interview data.*?type.*?(\w+).*?role.*?([^,]+).*?level.*?(\w+).*?tech stack.*?([^,]+).*?amount.*?(\d+)/i
        );

        // If not found in last message, try the full conversation
        if (!simplePattern) {
          console.log(
            "[Debug] Not found in last message, trying full conversation"
          );
          simplePattern = conversation.match(
            /interview data.*?type.*?(\w+).*?role.*?([^,]+).*?level.*?(\w+).*?tech stack.*?([^,]+).*?amount.*?(\d+)/i
          );
        }

        console.log("[Debug] Simple pattern match result:", simplePattern);

        if (simplePattern) {
          const interviewData = {
            type: simplePattern[1].toLowerCase(),
            role: simplePattern[2].trim(),
            level: simplePattern[3].toLowerCase(),
            techstack: simplePattern[4].trim(),
            amount: parseInt(simplePattern[5]),
          };

          console.log(
            "[Debug] Extracted interview data from bot format:",
            interviewData
          );

          try {
            const response = await fetch("/api/vapi/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...interviewData,
                userid: userId,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log(
                "Interview created successfully from bot format:",
                result
              );
              router.push("/?refresh=true");
              return;
            } else {
              const errorData = await response.json();
              console.error(
                "Failed to create interview from bot format:",
                errorData
              );
            }
          } catch (error) {
            console.error("Error creating interview from bot format:", error);
          }
        }

        // Fallback to individual pattern matching
        const roleMatch = conversation.match(
          /(?:role|position|job).*?:\s*([^.\n]+)/i
        );
        const levelMatch = conversation.match(
          /(?:level|experience).*?:\s*(junior|mid|senior)/i
        );
        const techMatch = conversation.match(
          /(?:tech|stack|skills).*?:\s*([^.\n]+)/i
        );
        const typeMatch = conversation.match(
          /(?:type|focus).*?:\s*(technical|behavioral|mixed)/i
        );
        const amountMatch = conversation.match(
          /(?:amount|number|questions).*?:\s*(\d+)/i
        );

        if (roleMatch && levelMatch && techMatch && typeMatch && amountMatch) {
          const interviewData = {
            role: roleMatch[1].trim(),
            level: levelMatch[1].toLowerCase(),
            techstack: techMatch[1].trim(),
            type: typeMatch[1].toLowerCase(),
            amount: parseInt(amountMatch[1]),
          };

          console.log("[Debug] Extracted interview data:", interviewData);

          try {
            const response = await fetch("/api/vapi/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...interviewData,
                userid: userId,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log(
                "Interview created successfully from extracted data:",
                result
              );
              router.push("/?refresh=true");
              return;
            } else {
              const errorData = await response.json();
              console.error(
                "Failed to create interview from extracted data:",
                errorData
              );
            }
          } catch (error) {
            console.error(
              "Error creating interview from extracted data:",
              error
            );
          }
        }

        // If all else fails, redirect anyway
        console.log(
          "[Debug] Could not extract interview data, redirecting anyway"
        );
        router.push("/?refresh=true");
      };

      if (callStatus === CallStatus.FINISHED) {
        if (type === "generate") {
          handleGenerateInterview();
        } else {
          handleGenerateFeedback(messages);
        }
      }

      // Add timeout mechanism for generate type
      if (
        type === "generate" &&
        callStatus === CallStatus.FINISHED &&
        callStartTime
      ) {
        const callDuration = Date.now() - callStartTime;
        const hasInterviewData = messages.some((msg) =>
          msg.content.includes("INTERVIEW_DATA:")
        );

        if (!hasInterviewData && callDuration > 300000) {
          // 5 minutes timeout
          console.log(
            "[Debug] Timeout reached, forcing interview creation with default data"
          );

          // Use setTimeout to handle async operation
          setTimeout(async () => {
            try {
              const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "mixed",
                  role: "Software Developer",
                  level: "junior",
                  techstack: "JavaScript, React",
                  amount: 10,
                  userid: userId,
                }),
              });

              if (response.ok) {
                console.log("Default interview created successfully");
              } else {
                console.error("Failed to create default interview");
              }
            } catch (error) {
              console.error("Error creating default interview:", error);
            }

            router.push("/?refresh=true");
          }, 0);
        }
      }
    }
  }, [
    messages,
    callStatus,
    feedbackId,
    interviewId,
    router,
    type,
    userId,
    callStartTime,
  ]);

  // const handleCall = async () => {
  //   setCallStatus(CallStatus.CONNECTING);

  //   if (type === "generate") {
  //     await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
  //       variableValues: {
  //         username: userName,
  //         userid: userId,
  //       },
  //     });
  //   } else {
  //     let formattedQuestions = "";
  //     if (questions) {
  //       formattedQuestions = questions
  //         .map((question) => `- ${question}`)
  //         .join("\n");
  //     }

  //     await vapi.start(interviewer, {
  //       variableValues: {
  //         questions: formattedQuestions,
  //       },
  //     });
  //   }
  // };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        // For generate type, use a modified interviewer that collects interview details first
        await vapi.start(
          {
            ...interviewer,
            firstMessage: `Hello ${userName}! I'm here to help you create a personalized interview. Let me ask you a few questions to generate the perfect interview for you.

First, what role or position are you interviewing for?`,
            //             model: {
            //               provider: "openai",
            //               model: "gpt-4",
            //               messages: [
            //                 {
            //                   role: "system",
            //                   content: `You are an AI assistant helping to create a personalized job interview. Your task is to:

            // 1. Ask the user for their desired role/position
            // 2. Ask for their experience level (Junior, Mid-level, Senior)
            // 3. Ask for their tech stack or skills
            // 4. Ask for the type of interview they want (Technical, Behavioral, or Mixed)
            // 5. Ask how many questions they want (5-15)

            // Once you have all this information, summarize it in this exact format:
            // INTERVIEW_DATA:
            // {
            //   "type": "[their chosen type]",
            //   "role": "[their role]",
            //   "level": "[their level]",
            //   "techstack": "[their tech stack]",
            //   "amount": [number of questions]
            // }

            // Then thank them and let them know their interview has been created and they can find it on their dashboard.

            // Be conversational and helpful throughout the process.`,
            //                 },
            //               ],
            //             },
            model: {
              provider: "openai",
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: `You are an AI assistant helping create a personalized job interview.

You will ask the user for:
1. Their desired role/position
2. Their experience level (Junior, Mid-level, Senior)
3. Their tech stack or skills
4. The type of interview they want (Technical, Behavioral, or Mixed)
5. How many questions they want (5-15)

Be conversational and helpful. Ask one question at a time and wait for their response.

CRITICAL: After collecting all information, your FINAL message must be ONLY this exact format:

INTERVIEW_DATA: {"type": "technical", "role": "Frontend Developer", "level": "junior", "techstack": "React, TypeScript", "amount": 10}

Examples of correct final messages:
- INTERVIEW_DATA: {"type": "mixed", "role": "Backend Developer", "level": "senior", "techstack": "Node.js, MongoDB", "amount": 12}
- INTERVIEW_DATA: {"type": "behavioral", "role": "Product Manager", "level": "mid", "techstack": "Agile, Scrum", "amount": 8}

DO NOT add any other text, explanations, or thank you messages. ONLY output the INTERVIEW_DATA line.`,
                },
              ],
            },
          },
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );
      } else {
        // For interview type, use the interviewer assistant with specific questions
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            username: userName,
            userid: userId,
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const handleManualGenerate = async () => {
    console.log("[Debug] Manual generate triggered");
    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mixed",
          role: "Software Developer",
          level: "junior",
          techstack: "JavaScript, React",
          amount: 10,
          userid: userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Manual interview created successfully:", result);
        router.push("/?refresh=true");
      } else {
        const errorData = await response.json();
        console.error("Failed to create manual interview:", errorData);
      }
    } catch (error) {
      console.error("Error creating manual interview:", error);
    }
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center gap-4 mt-8 mb-4">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}

        {/* Debug button for testing */}
        {type === "generate" && callStatus === "FINISHED" && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={handleManualGenerate}
          >
            Manual Generate (Debug)
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;

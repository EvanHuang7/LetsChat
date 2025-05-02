import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { getStreamToken } from "../lib/tanStackQueryApis";

import { useAuthStore } from "../store/useAuthStore";

const STREAM_API_KEY = "q5hrvvpqynvk";

const CallPage = () => {
  const { authUser } = useAuthStore();

  // Stream video client of this user
  const [client, setClient] = useState(null);
  // A call room instance unique by the callId
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { conversationId: callId } = useParams();

  const { data: userStreamTokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const initCall = async () => {
    if (!authUser || !userStreamTokenData?.token || !callId) return;

    try {
      const user = {
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic,
      };

      const videoClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user,
        token: userStreamTokenData.token,
      });

      const callInstance = videoClient.call("default", callId);
      // if create: true, the call will be created if it doesn't exist
      await callInstance.join({ create: true });

      setClient(videoClient);
      setCall(callInstance);
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join the call. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    initCall();
  }, [userStreamTokenData, authUser, callId]);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent callId={callId} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = ({ callId }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT)
    return navigate(`/conversation/${callId}`);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;

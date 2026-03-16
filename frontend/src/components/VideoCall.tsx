import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Fab, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import VideoCallIcon from "@mui/icons-material/VideoCall";

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

interface VideoCallProps {
    displayName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ displayName }) => {
    const [open, setOpen] = useState(false);
    const [roomName, setRoomName] = useState<string>("");

    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleOpen = () => {
        setRoomName(`LOK-bank-video-assistant-session-${Date.now()}`);
        setOpen(true);
    };

    const initJitsi = () => {
        if (!jitsiContainerRef.current || apiRef.current || !roomName) return;

        const domain = "meet.jit.si";

        const options = {
            roomName,
            parentNode: jitsiContainerRef.current,
            width: "100%",
            height: "100%",
            configOverwrite: {
                prejoinPageEnabled: false,
                disableDeepLinking: true,
                startWithAudioMuted: false,
                startWithVideoMuted: false
            },
            interfaceConfigOverwrite: {
                TILE_VIEW_MAX_COLUMNS: 2,
                TOOLBAR_BUTTONS: [
                    "microphone",
                    "camera",
                    "desktop",
                    "fullscreen",
                    "hangup",
                    "chat",
                    "settings"
                ]
            },
            userInfo: { displayName }
        };

        if (videoRef.current) {
            const stream = (videoRef.current as any).captureStream();
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                navigator.mediaDevices
            );
            navigator.mediaDevices.getUserMedia = async (constraints) =>
                stream || originalGetUserMedia(constraints);
        }

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        apiRef.current.addEventListeners({
            readyToClose: () => setOpen(false),
            videoConferenceLeft: () => setOpen(false)
        });
    };

    useEffect(() => {
        if (!open) return;

        const existingScript = document.getElementById("jitsi-script");

        if (!window.JitsiMeetExternalAPI) {
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = "jitsi-script";
                script.src = "https://meet.jit.si/external_api.js";
                script.async = true;
                script.onload = initJitsi;
                document.body.appendChild(script);
            }
        } else {
            setTimeout(initJitsi, 100);
        }

        return () => {
            if (apiRef.current) {
                apiRef.current.dispose();
                apiRef.current = null;
            }
        };
    }, [open, roomName]);

    // Inner component: hidden agent
    const AgentParticipant: React.FC<{ roomName: string }> = ({ roomName }) => {
        const agentRef = useRef<HTMLDivElement>(null);
        const agentVideoRef = useRef<HTMLVideoElement>(null);

        useEffect(() => {
            if (!roomName || !agentRef.current || !window.JitsiMeetExternalAPI)
                return;

            const options = {
                roomName,
                parentNode: agentRef.current,
                width: 1,
                height: 1,
                configOverwrite: { startWithAudioMuted: true, startWithVideoMuted: false },
                interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false },
                userInfo: { displayName: "Alex - Secure Vault" }
            };

            if (agentVideoRef.current) {
                const stream = (agentVideoRef.current as any).captureStream();
                const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                    navigator.mediaDevices
                );
                navigator.mediaDevices.getUserMedia = async (constraints) =>
                    stream || origGetUserMedia(constraints);
            }

            const api = new window.JitsiMeetExternalAPI("meet.jit.si", options);
            return () => api.dispose();
        }, [roomName]);

        return (
            <>
                <div ref={agentRef} style={{ display: "none" }} />
                <video
                    ref={agentVideoRef}
                    src="/agent_greeting_videocall.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ display: "none" }}
                />
            </>
        );
    };

    return (
        <>
            {/* Floating video button */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 100,
                    right: 30,
                    zIndex: 1000
                }}
            >
                <Fab color="primary" aria-label="video support" onClick={handleOpen}>
                    <VideoCallIcon
                        sx={{
                            fontSize: 24,
                            color: "secondary.main",
                            width: 28,
                            height: 28
                        }}
                    />
                </Fab>
            </Box>

            {/* Video dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
                fullWidth
                slotProps={{
                    paper: {
                        sx: { borderRadius: 3, overflow: "hidden", height: "80vh" }
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "primary.main",
                        color: "white"
                    }}
                >
                    <Typography fontWeight={700}>Secure Vault Video Support</Typography>
                    <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        p: 0,
                        height: "100%",
                        bgcolor: "#000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {!apiRef.current && (
                        <Typography sx={{ color: "white" }}>
                            Establishing Secure Connection...
                        </Typography>
                    )}
                    <div ref={jitsiContainerRef} style={{ width: "100%", height: "100%" }} />
                </DialogContent>
            </Dialog>

            {/* Hidden local video */}
            <video
                ref={videoRef}
                src="/agent_greeting_videocall.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ display: "none" }}
            />

            {/* Hidden agent participant */}
            {roomName && <AgentParticipant roomName={roomName} />}
        </>
    );
};

export default VideoCall;
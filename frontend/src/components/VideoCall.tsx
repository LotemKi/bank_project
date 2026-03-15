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

    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);

    const initJitsi = () => {
        if (!jitsiContainerRef.current || apiRef.current) return;

        const domain = "meet.jit.si";

        const options = {
            roomName: `LOK-bank-video-assistant-session-${Date.now()}`,
            parentNode: jitsiContainerRef.current,
            width: "100%",
            height: "100%",
            configOverwrite: {
                prejoinPageEnabled: false,
                disableDeepLinking: true,
                startWithAudioMuted: false,
                startWithVideoMuted: false,
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
                ],
            },
            userInfo: { displayName }
        };

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
    }, [open]);

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
                <Fab
                    color="primary"
                    aria-label="video support"
                    onClick={() => setOpen(true)}
                >
                    <VideoCallIcon sx={{ fontSize: 24, color: "secondary.main", width: 28, height: 28 }} />
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
                        sx: {
                            borderRadius: 3,
                            overflow: "hidden",
                            height: "80vh"
                        }
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
                    <Typography fontWeight={700}>
                        Secure Vault Video Support
                    </Typography>

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

                    <div
                        ref={jitsiContainerRef}
                        style={{ width: "100%", height: "100%" }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default VideoCall;
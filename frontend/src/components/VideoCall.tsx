import React, { useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

interface VideoCallProps {
    open: boolean;
    onClose: () => void;
    displayName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ open, onClose, displayName }) => {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);

    const initJitsi = () => {
        if (!jitsiContainerRef.current || apiRef.current) return;

        const domain = "meet.jit.si";
        const options = {
            roomName: `LOK-bank-video-assistant-session-${Date.now()}`,
            parentNode: jitsiContainerRef.current,
            width: "100%",
            height: 450,
            configOverwrite: {
                prejoinPageEnabled: false,
                disableDeepLinking: true,
                startWithAudioMuted: false,
                startWithVideoMuted: false,
            },
            interfaceConfigOverwrite: {
                TILE_VIEW_MAX_COLUMNS: 2,
                TOOLBAR_BUTTONS: ['microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'hangup', 'chat', 'settings'],
            },
            userInfo: { displayName },
        };

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        apiRef.current.addEventListeners({
            readyToClose: () => {
                onClose();
            },
            videoConferenceLeft: () => {
                onClose();
            }
        });
    };

    useEffect(() => {
        if (!open) return;

        const existingScript = document.getElementById('jitsi-script');

        if (!window.JitsiMeetExternalAPI) {
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = 'jitsi-script';
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
        <Dialog
            open={open}
            onClose={(reason) => {
                if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    return;
                }
                onClose();
            }}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 3, overflow: 'hidden' }
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight={700}>Secure Vault Video Support</Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, height: 450, bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Fallback loader */}
                {!apiRef.current && <Typography sx={{ color: 'white' }}>Establishing Secure Connection...</Typography>}
                <div ref={jitsiContainerRef} style={{ width: "100%", height: "100%" }} />
            </DialogContent>
        </Dialog>
    );
};

export default VideoCall;
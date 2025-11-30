import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoPlayerProps {
    videoUri: string;
    thumbnailUri?: string;
    title?: string;
    onComplete?: () => void;
    onProgress?: (progress: number) => void;
    autoPlay?: boolean;
    initialPlaybackSpeed?: number;
    style?: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUri,
    thumbnailUri,
    title,
    onComplete,
    onProgress,
    autoPlay = false,
    initialPlaybackSpeed = 1.0,
    style,
}) => {
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(initialPlaybackSpeed);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (showControls) {
            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
            controlsTimeout.current = setTimeout(() => {
                if (status?.isLoaded && status.isPlaying) {
                    hideControls();
                }
            }, 3000);
        }
        return () => {
            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        };
    }, [showControls, status]);

    const showControlsOverlay = () => {
        setShowControls(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideControls = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowControls(false));
    };

    const togglePlayPause = async () => {
        if (!videoRef.current) return;
        if (status?.isLoaded && status.isPlaying) {
            await videoRef.current.pauseAsync();
            showControlsOverlay();
        } else {
            await videoRef.current?.playAsync();
        }
    };

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        setStatus(status);
        if (status.isLoaded) {
            if (status.didJustFinish && onComplete) {
                onComplete();
                showControlsOverlay();
            }
            if (onProgress) {
                const progress = status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0;
                onProgress(progress);
            }
        }
    };

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const cycleSpeed = async () => {
        const speeds = [0.5, 1.0, 1.5, 2.0];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
        if (videoRef.current) {
            await videoRef.current.setRateAsync(nextSpeed, true);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity activeOpacity={1} onPress={showControlsOverlay} style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: videoUri }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    shouldPlay={autoPlay}
                    posterSource={thumbnailUri ? { uri: thumbnailUri } : undefined}
                    posterStyle={{ resizeMode: 'cover' }}
                    usePoster={true}
                />
            </TouchableOpacity>

            {/* Controls Overlay */}
            <Animated.View style={[styles.controls, { opacity: fadeAnim }]} pointerEvents={showControls ? 'auto' : 'none'}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <TouchableOpacity onPress={cycleSpeed} style={styles.speedButton}>
                        <Text style={styles.speedText}>{playbackSpeed}x</Text>
                    </TouchableOpacity>
                </View>

                {/* Center Play/Pause */}
                <View style={styles.centerControls}>
                    {status?.isLoaded && status.isBuffering ? (
                        <ActivityIndicator size="large" color={COLORS.white} />
                    ) : (
                        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                            <FontAwesome5
                                name={status?.isLoaded && status.isPlaying ? 'pause' : 'play'}
                                size={32}
                                color={COLORS.white}
                                style={{ marginLeft: status?.isLoaded && status.isPlaying ? 0 : 4 }}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <Text style={styles.timeText}>
                        {status?.isLoaded ? formatTime(status.positionMillis) : '0:00'}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={status?.isLoaded ? status.durationMillis : 1}
                        value={status?.isLoaded ? status.positionMillis : 0}
                        minimumTrackTintColor={COLORS.primary}
                        maximumTrackTintColor="rgba(255,255,255,0.3)"
                        thumbTintColor={COLORS.white}
                        onSlidingStart={() => {
                            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
                        }}
                        onSlidingComplete={async (value) => {
                            if (videoRef.current) {
                                await videoRef.current.setPositionAsync(value);
                            }
                            // Restart auto-hide timer
                            if (status?.isLoaded && status.isPlaying) {
                                controlsTimeout.current = setTimeout(() => hideControls(), 3000);
                            }
                        }}
                    />
                    <Text style={styles.timeText}>
                        {status?.isLoaded && status.durationMillis ? formatTime(status.durationMillis) : '0:00'}
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: COLORS.black,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
    controls: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.medium,
        color: COLORS.white,
        fontSize: FONTS.sizes.sm,
    },
    speedButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    speedText: {
        fontFamily: FONTS.bold,
        color: COLORS.white,
        fontSize: 12,
    },
    centerControls: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        marginHorizontal: SPACING.sm,
        height: 40,
    },
    timeText: {
        fontFamily: FONTS.regular,
        color: COLORS.white,
        fontSize: 12,
        fontVariant: ['tabular-nums'],
    },
});

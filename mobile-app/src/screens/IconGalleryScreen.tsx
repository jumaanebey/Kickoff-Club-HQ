import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import {
    CoinIcon, EnergyIcon, KPIcon, XPIcon,
    TrainIcon, UpgradeIcon, PlayIcon, CollectIcon, SpeedUpIcon,
    TrainingIcon, ReadyIcon, LockedIcon, CompleteIcon,
    StadiumIcon, PracticeFieldIcon, FilmRoomIcon, HeadquartersIcon, WeightRoomIcon,
    QuarterbackIcon, LinebackerIcon, ReceiverIcon, CoachIcon,
    DraftRoomIcon, ConcessionIcon, LockerRoomIcon, LeagueIcon, MissionsIcon,
    FirstUpgradeIcon, MasterBuilderIcon, EmpireBuilderIcon
} from '../components/icons';
import {
    OnboardingWelcomeIllustration, OnboardingLearnIllustration, OnboardingBuildingsIllustration,
    EmptyBuildingsIllustration, EmptyAchievementsIllustration, ConnectionErrorIllustration
} from '../components/illustrations';
import { GameIcon } from '../components/GameIcon';

const IconWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <View style={styles.iconContainer}>
        <View style={styles.iconBox}>
            {children}
        </View>
        <Text style={styles.label}>{label}</Text>
    </View>
);

export default function IconGalleryScreen() {
    const sections = [
        {
            title: 'Resources',
            icons: [
                { name: 'Coins', component: <CoinIcon size={64} /> },
                { name: 'Energy', component: <EnergyIcon size={64} /> },
                { name: 'KP', component: <KPIcon size={64} /> },
                { name: 'XP', component: <XPIcon size={64} /> },
            ]
        },
        {
            title: 'Actions',
            icons: [
                { name: 'Train', component: <TrainIcon size={64} /> },
                { name: 'Upgrade', component: <UpgradeIcon size={64} /> },
                { name: 'Play', component: <PlayIcon size={64} /> },
                { name: 'Collect', component: <CollectIcon size={64} /> },
                { name: 'Speed Up', component: <SpeedUpIcon size={64} /> },
            ]
        },
        {
            title: 'Status',
            icons: [
                { name: 'Training', component: <TrainingIcon size={64} /> },
                { name: 'Ready', component: <ReadyIcon size={64} /> },
                { name: 'Locked', component: <LockedIcon size={64} /> },
                { name: 'Complete', component: <CompleteIcon size={64} /> },
            ]
        },
        {
            title: 'Buildings (Batch 2)',
            icons: [
                { name: 'HQ (Cabin)', component: <HeadquartersIcon size={80} /> },
                { name: 'Stadium', component: <StadiumIcon size={80} /> },
                { name: 'Practice', component: <PracticeFieldIcon size={80} /> },
                { name: 'Film Room', component: <FilmRoomIcon size={80} /> },
                { name: 'Weight Room', component: <WeightRoomIcon size={80} /> },
            ]
        },
        {
            title: 'Characters (Training Units)',
            icons: [
                { name: 'QB', component: <QuarterbackIcon size={80} /> },
                { name: 'LB', component: <LinebackerIcon size={80} /> },
                { name: 'WR', component: <ReceiverIcon size={80} /> },
                { name: 'Coach', component: <CoachIcon size={80} /> },
            ]
        },
        {
            title: 'Misc & Features',
            icons: [
                { name: 'Draft', component: <DraftRoomIcon size={80} /> },
                { name: 'Hotdogs', component: <ConcessionIcon size={80} /> },
                { name: 'Lockers', component: <LockerRoomIcon size={80} /> },
                { name: 'League', component: <LeagueIcon size={80} /> },
                { name: 'Missions', component: <MissionsIcon size={80} /> },
            ]
        },
        {
            title: 'Achievements',
            icons: [
                { name: '1st Upgrade', component: <FirstUpgradeIcon size={80} /> },
                { name: 'Master', component: <MasterBuilderIcon size={80} /> },
                { name: 'Empire', component: <EmpireBuilderIcon size={80} /> },
            ]
        },
        {
            title: 'Full Scenes (Illustrations)',
            icons: [
                { name: 'Welcome', component: <OnboardingWelcomeIllustration size={100} /> },
                { name: 'Learn', component: <OnboardingLearnIllustration size={100} /> },
                { name: 'City', component: <OnboardingBuildingsIllustration size={100} /> },
                { name: 'Empty Land', component: <EmptyBuildingsIllustration size={100} /> },
                { name: 'Empty Case', component: <EmptyAchievementsIllustration size={100} /> },
                { name: 'Offline', component: <ConnectionErrorIllustration size={100} /> },
            ]
        },
        {
            title: 'GameIcon Integration',
            icons: [
                { name: 'coins', component: <GameIcon name="coins" size={48} /> },
                { name: 'stadium', component: <GameIcon name="stadium" size={48} /> },
                { name: 'fallback', component: <GameIcon name="dumbbell" size={48} style={{ color: '#000' }} /> },
            ]
        }
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Cozy Sports Icons</Text>

            {sections.map((section, index) => (
                <View key={index}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.grid}>
                        {section.icons.map((icon, iconIndex) => (
                            <IconWrapper key={iconIndex} label={icon.name}>
                                {icon.component}
                            </IconWrapper>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e', // Dark background to make them pop
    },
    content: {
        padding: 20,
        paddingBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#A8E6CF', // Cozy mint
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 15,
    },
    iconContainer: {
        alignItems: 'center',
        width: '30%',
        marginBottom: 15,
    },
    iconBox: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    label: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
    },
});

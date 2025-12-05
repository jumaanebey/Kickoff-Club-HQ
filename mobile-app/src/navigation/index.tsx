import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Auth Screens
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Main Screens
import HQScreen from '../screens/Main/HQScreen';
import SquadScreen from '../screens/Main/SquadScreen';
import MatchScreen from '../screens/Main/MatchScreen';
import PredictScreen from '../screens/Main/PredictScreen';
import LearnScreen from '../screens/Main/LearnScreen';
import ShopScreen from '../screens/Main/ShopScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

// Learn Stack Screens
import CourseDetailScreen from '../screens/Main/CourseDetailScreen';
import LessonPlayerScreen from '../screens/Main/LessonPlayerScreen';

// HQ Stack Screens
import PracticeFieldScreen from '../screens/Main/PracticeFieldScreen_v2';

import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const LearnStack = createNativeStackNavigator();
const HQStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const LearnNavigator = () => (
  <LearnStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <LearnStack.Screen name="CourseList" component={LearnScreen} />
    <LearnStack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <LearnStack.Screen name="LessonPlayer" component={LessonPlayerScreen} />
  </LearnStack.Navigator>
);

const HQNavigator = () => (
  <HQStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <HQStack.Screen name="HQMain" component={HQScreen} />
    <HQStack.Screen name="PracticeField" component={PracticeFieldScreen} />
  </HQStack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.backgroundLight,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'HQ':
            iconName = focused ? 'grid' : 'grid-outline';
            break;
          case 'Squad':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Match':
            iconName = focused ? 'football' : 'football-outline';
            break;
          case 'Predict':
            iconName = focused ? 'trophy' : 'trophy-outline';
            break;
          case 'Learn':
            iconName = focused ? 'play-circle' : 'play-circle-outline';
            break;
          case 'Shop':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="HQ" component={HQNavigator} />
    <Tab.Screen name="Squad" component={SquadScreen} />
    <Tab.Screen name="Match" component={MatchScreen} />
    <Tab.Screen name="Predict" component={PredictScreen} />
    <Tab.Screen name="Learn" component={LearnNavigator} />
    <Tab.Screen name="Shop" component={ShopScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const Navigation = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

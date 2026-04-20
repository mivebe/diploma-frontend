import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EventsListScreen from '../screens/EventsListScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: '#1F3864' }}>
      <Tabs.Screen name="Събития" component={EventsListScreen} />
      <Tabs.Screen name="Календар" component={CalendarScreen} />
      <Tabs.Screen name="Резервации" component={MyReservationsScreen} />
      <Tabs.Screen name="Профил" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function OrganizerTabs() {
  return (
    <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: '#1F3864' }}>
      <Tabs.Screen name="Събития" component={EventsListScreen} />
      <Tabs.Screen name="Календар" component={CalendarScreen} />
      <Tabs.Screen name="Моите събития" component={MyEventsScreen} />
      <Tabs.Screen name="Профил" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>;

  return (
    <NavigationContainer>
      {user ? (
        <AppStack.Navigator>
          <AppStack.Screen name="Home" options={{ headerShown: false }}
            component={user.role === 'organizer' ? OrganizerTabs : UserTabs} />
          <AppStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Детайли' }} />
          <AppStack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Ново събитие' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

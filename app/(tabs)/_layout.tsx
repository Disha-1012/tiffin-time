import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#C9A96E", // GOLD
        tabBarInactiveTintColor: "#888",

        tabBarStyle: {
          backgroundColor: "#1A120B", // DARK
          borderTopWidth: 0,
          height: 65,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },

        tabBarButton: HapticTab,
      }}
    >
      {/* 🏠 HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />

      {/* 📞 CONTACT */}
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🍽️ EXPLORE / MENU */}
      <Tabs.Screen
        name="menu" // ⚠️ IMPORTANT: use "menu" not "explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="fork.knife" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
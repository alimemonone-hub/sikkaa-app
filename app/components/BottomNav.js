import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, Users, CircleUser } from 'lucide-react-native';

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', label: 'HOME', Icon: Home },
    { name: 'Referral', label: 'TEAM', Icon: Users },
    { name: 'History', label: 'MINE', Icon: CircleUser },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => {
        const isActive = route.name === tab.name;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.name)}
          >
            <tab.Icon color={isActive ? '#7c5cfc' : '#5b5b66'} size={24} />
            <Text style={isActive ? styles.navLabelActive : styles.navLabelInactive}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#0f0c1b',
    borderTopWidth: 1,
    borderTopColor: '#1d1929',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabelActive: {
    color: '#7c5cfc',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelInactive: {
    color: '#5b5b66',
    fontSize: 11,
    marginTop: 4,
  },
});

export default BottomNav;
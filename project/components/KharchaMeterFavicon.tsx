import React from 'react';
import { View, Text } from 'react-native';

// Simple KharchaMeter logo for favicon
export const KharchaMeterFavicon = () => {
  return (
    <View style={{
      width: 32,
      height: 32,
      backgroundColor: '#1e3a8a', // Dark blue background
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Wallet icon simplified */}
      <View style={{
        width: 20,
        height: 14,
        backgroundColor: '#fbbf24', // Yellow wallet
        borderRadius: 4,
        position: 'relative'
      }}>
        {/* Dollar sign */}
        <Text style={{
          position: 'absolute',
          top: -2,
          left: 7,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#ffffff'
        }}>$</Text>
      </View>
      
      {/* Growth arrow */}
      <View style={{
        position: 'absolute',
        top: 4,
        right: 4,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#10b981', // Green arrow
        transform: [{ rotate: '45deg' }]
      }} />
    </View>
  );
};

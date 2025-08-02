import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  size?: number;
  variant?: 'default' | 'minimal' | 'icon-only';
}

export function Logo({ size = 60, variant = 'default' }: LogoProps) {
  const { colors } = useTheme();
  
  const containerSize = size;
  const walletSize = size * 0.4;
  const dollarSize = size * 0.25;
  const arrowSize = size * 0.15;

  return (
    <View style={[
      styles.container,
      {
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: '#1E3A8A', // Professional blue
      }
    ]}>
      {/* Wallet */}
      <View style={[
        styles.wallet,
        {
          width: walletSize,
          height: walletSize * 0.75,
          backgroundColor: '#FCD34D', // Professional yellow
          borderRadius: walletSize * 0.1,
        }
      ]}>
        {/* Wallet clasp */}
        <View style={[
          styles.clasp,
          {
            width: walletSize * 0.15,
            height: walletSize * 0.4,
            backgroundColor: '#1E3A8A',
            right: -walletSize * 0.05,
            top: walletSize * 0.1,
          }
        ]} />
      </View>

      {/* Dollar sign */}
      <View style={[
        styles.dollarContainer,
        {
          width: dollarSize,
          height: dollarSize,
          borderRadius: dollarSize / 2,
          backgroundColor: '#FFFFFF',
          right: -size * 0.15,
          bottom: size * 0.15,
        }
      ]}>
        <View style={[
          styles.dollarSign,
          {
            width: dollarSize * 0.6,
            height: dollarSize * 0.6,
          }
        ]}>
          {/* Dollar symbol using geometric shapes */}
          <View style={[
            styles.dollarBar,
            {
              width: dollarSize * 0.15,
              height: dollarSize * 0.5,
              backgroundColor: '#1E3A8A',
            }
          ]} />
          <View style={[
            styles.dollarCurve,
            {
              width: dollarSize * 0.4,
              height: dollarSize * 0.2,
              borderWidth: dollarSize * 0.08,
              borderColor: '#1E3A8A',
              borderRadius: dollarSize * 0.1,
              borderBottomColor: 'transparent',
            }
          ]} />
        </View>
      </View>

      {/* Growth arrow */}
      <View style={[
        styles.arrow,
        {
          right: -size * 0.05,
          top: size * 0.1,
        }
      ]}>
        <View style={[
          styles.arrowLine,
          {
            width: arrowSize * 2,
            height: arrowSize * 0.3,
            backgroundColor: '#10B981', // Professional green
            transform: [{ rotate: '-30deg' }],
          }
        ]} />
        <View style={[
          styles.arrowHead,
          {
            width: 0,
            height: 0,
            borderLeftWidth: arrowSize * 0.4,
            borderTopWidth: arrowSize * 0.3,
            borderBottomWidth: arrowSize * 0.3,
            borderLeftColor: '#10B981',
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            right: -arrowSize * 0.1,
            top: -arrowSize * 0.15,
          }
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  wallet: {
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  clasp: {
    position: 'absolute',
    borderRadius: 2,
  },
  dollarContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  dollarSign: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dollarBar: {
    position: 'absolute',
    borderRadius: 1,
  },
  dollarCurve: {
    position: 'absolute',
  },
  arrow: {
    position: 'absolute',
  },
  arrowLine: {
    borderRadius: 2,
  },
  arrowHead: {
    position: 'absolute',
  },
});

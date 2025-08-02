import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SupabaseSetupGuide } from './SupabaseSetupGuide';
import { AlertTriangle, X } from 'lucide-react-native';

export function SupabaseSetupBanner() {
  const { colors } = useTheme();
  const [showGuide, setShowGuide] = useState(false);

  const openSetupGuide = () => {
    setShowGuide(true);
  };

  // Convert hex color to rgba for transparency that works on web and native
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <>
      <View style={[styles.banner, { backgroundColor: hexToRgba(colors.warning, 0.125), borderColor: colors.warning }]}>
        <View style={styles.content}>
          <AlertTriangle size={20} color={colors.warning} />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Supabase Not Configured
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              App is running in demo mode. Set up Supabase for full functionality.
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.warning }]}
          onPress={openSetupGuide}
        >
          <Text style={styles.buttonText}>Setup Guide</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showGuide}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowGuide(false)}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <SupabaseSetupGuide />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
});

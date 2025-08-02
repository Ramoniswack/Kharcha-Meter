import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CheckCircle, Circle, ExternalLink, Copy } from 'lucide-react-native';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link?: string;
}

export function SupabaseSetupGuide() {
  const { colors } = useTheme();
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: '1',
      title: 'Create Supabase Account',
      description: 'Sign up at supabase.com and create a new project',
      completed: false,
      link: 'https://supabase.com'
    },
    {
      id: '2', 
      title: 'Run Database Schema',
      description: 'Copy supabase-schema.sql content to SQL Editor and run it',
      completed: false
    },
    {
      id: '3',
      title: 'Get Project Credentials',
      description: 'Copy Project URL and anon key from Settings → API',
      completed: false
    },
    {
      id: '4',
      title: 'Update Environment File',
      description: 'Paste credentials in .env file and restart app',
      completed: false
    },
    {
      id: '5',
      title: 'Setup OAuth (Optional)',
      description: 'Configure Google/GitHub OAuth for social login',
      completed: false
    }
  ]);

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening link:', err));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Supabase Setup Guide
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Follow these steps to connect your app to Supabase
        </Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={[styles.stepCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.stepHeader}
              onPress={() => toggleStep(step.id)}
            >
              {step.completed ? (
                <CheckCircle size={24} color={colors.success} />
              ) : (
                <Circle size={24} color={colors.textSecondary} />
              )}
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  {index + 1}. {step.title}
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  {step.description}
                </Text>
              </View>
            </TouchableOpacity>
            
            {step.link && (
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => openLink(step.link!)}
              >
                <ExternalLink size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={[styles.quickActions, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => openLink('https://supabase.com')}
        >
          <Text style={styles.actionButtonText}>Open Supabase</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
          onPress={() => openLink('https://console.cloud.google.com')}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Google Console</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.envExample, { backgroundColor: colors.background, borderColor: colors.warning }]}>
        <Text style={[styles.envTitle, { color: colors.text }]}>
          📝 .env File Example
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: colors.surface }]}>
          <Text style={[styles.codeText, { color: colors.textSecondary }]}>
            {`EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  stepCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  linkButton: {
    padding: 8,
  },
  quickActions: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  envExample: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  envTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
});

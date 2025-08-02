import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { expenseCategories, incomeCategories, getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons';
import { 
  Plus, 
  Minus, 
  Calendar, 
  Tag,
  FileText,
  Save,
  RotateCcw,
  Check
} from 'lucide-react-native';

export default function AddTransactionScreen() {
  const { colors } = useTheme();
  const { createTransaction } = useData();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedAmount, setSavedAmount] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  // Validation functions
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (numericAmount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else if (numericAmount > 1000000) {
        newErrors.amount = 'Amount must be less than ₹10,00,000';
      }
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    setIsLoading(true);
    try {
      const success = await createTransaction({
        amount: parseFloat(amount),
        title: title.trim(),
        category,
        type,
        date: date,
        notes: notes.trim(),
      });

      if (success) {
        setSavedAmount(parseFloat(amount).toLocaleString());
        setShowSuccessModal(true);
        
        // Reset form after showing modal
        setTimeout(() => {
          setAmount('');
          setTitle('');
          setCategory('');
          setNotes('');
          setDate(new Date().toISOString());
          setErrors({});
          setShowSuccessModal(false);
        }, 2000);
      } else {
        Alert.alert('Error', 'Failed to save transaction. Please try again.');
      }
    } catch (error) {
      console.error('Transaction save error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compute styles to avoid web CSS parsing issues
  const saveButtonOpacity = isLoading ? 0.7 : 1;
  const saveButtonBackground = isLoading ? colors.border : colors.primary;

  const clearForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setNotes('');
    setDate(new Date().toISOString());
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add Transaction</Text>
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              { 
                backgroundColor: type === 'expense' ? colors.error : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => {
              setType('expense');
              setCategory(''); // Reset category when type changes
              setErrors({}); // Clear errors
            }}
          >
            <Minus size={20} color={type === 'expense' ? '#FFFFFF' : colors.error} />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'expense' ? '#FFFFFF' : colors.error }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              { 
                backgroundColor: type === 'income' ? colors.success : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => {
              setType('income');
              setCategory(''); // Reset category when type changes
              setErrors({}); // Clear errors
            }}
          >
            <Plus size={20} color={type === 'income' ? '#FFFFFF' : colors.success} />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'income' ? '#FFFFFF' : colors.success }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <FileText size={16} color={colors.textSecondary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: errors.title ? colors.error : colors.border 
                }
              ]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Enter transaction title"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.title && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.title}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>₹</Text>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Amount *</Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: errors.amount ? colors.error : colors.border 
                }
              ]}
              value={amount}
              onChangeText={(text) => {
                // Only allow numbers and decimal point
                const cleanText = text.replace(/[^0-9.]/g, '');
                setAmount(cleanText);
                if (errors.amount) {
                  setErrors(prev => ({ ...prev, amount: '' }));
                }
              }}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            {errors.amount && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Tag size={16} color={colors.textSecondary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Category *</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
              {categories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.name, type);
                const categoryColor = getCategoryColor(cat.name, type);
                return (
                  <TouchableOpacity
                    key={cat.name}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: category === cat.name ? categoryColor : colors.surface,
                        borderColor: errors.category && !category ? colors.error : colors.border
                      }
                    ]}
                    onPress={() => {
                      setCategory(cat.name);
                      if (errors.category) {
                        setErrors(prev => ({ ...prev, category: '' }));
                      }
                    }}
                  >
                    <IconComponent 
                      size={16} 
                      color={category === cat.name ? '#FFFFFF' : categoryColor} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      { color: category === cat.name ? '#FFFFFF' : colors.text }
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {errors.category && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.category}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Date & Time</Text>
            </View>
            <TouchableOpacity style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, justifyContent: 'center' }]}>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {new Date(date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <FileText size={16} color={colors.textSecondary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Notes (Optional)</Text>
            </View>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about this transaction"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={clearForm}
          >
            <RotateCcw size={20} color={colors.textSecondary} />
            <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>Clear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton, 
              { 
                backgroundColor: saveButtonBackground,
                opacity: saveButtonOpacity
              }
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
              <Check size={32} color="#fff" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Success! 🎉</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              {type === 'income' ? 'Income' : 'Expense'} of ₹{savedAmount} added successfully!
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
    marginHorizontal: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});
import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
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
  X,
  Check
} from 'lucide-react-native';

export default function EditTransactionScreen() {
  const { colors } = useTheme();
  const { updateTransaction, deleteTransaction, transactions } = useData();
  const params = useLocalSearchParams();
  const transactionId = params.id as string;
  
  // Find the transaction to edit
  const transaction = transactions.find(t => t.id === transactionId);
  
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [title, setTitle] = useState(transaction?.title || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [notes, setNotes] = useState(transaction?.notes || '');
  const [date, setDate] = useState(transaction?.date || new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!transaction) {
      Alert.alert('Error', 'Transaction not found');
      router.back();
    }
  }, [transaction]);

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

  const handleUpdate = async () => {
    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateTransaction(transactionId, {
        amount: parseFloat(amount),
        title: title.trim(),
        category,
        type,
        date: date,
        notes: notes.trim(),
      });

      if (success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.back();
        }, 2000);
      } else {
        Alert.alert('Error', 'Failed to update transaction');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await deleteTransaction(transactionId);
              if (success) {
                Alert.alert('Success', 'Transaction deleted successfully');
                router.back();
              } else {
                Alert.alert('Error', 'Failed to delete transaction');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting the transaction');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!transaction) {
    return null;
  }

  const buttonDisabled = isLoading;
  const buttonOpacity = buttonDisabled ? 0.7 : 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit Transaction</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Transaction Type Toggle */}
        <View style={[styles.typeContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && { backgroundColor: colors.error },
              { borderColor: colors.border }
            ]}
            onPress={() => setType('expense')}
          >
            <Minus size={20} color={type === 'expense' ? '#fff' : colors.error} />
            <Text style={[
              styles.typeText,
              { color: type === 'expense' ? '#fff' : colors.error }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && { backgroundColor: colors.success },
              { borderColor: colors.border }
            ]}
            onPress={() => setType('income')}
          >
            <Plus size={20} color={type === 'income' ? '#fff' : colors.success} />
            <Text style={[
              styles.typeText,
              { color: type === 'income' ? '#fff' : colors.success }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Amount *</Text>
          <View style={styles.amountInputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>₹</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          {errors.amount && <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount}</Text>}
        </View>

        {/* Title Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Title *</Text>
          <TextInput
            style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter transaction title"
            placeholderTextColor={colors.textSecondary}
          />
          {errors.title && <Text style={[styles.errorText, { color: colors.error }]}>{errors.title}</Text>}
        </View>

        {/* Category Selection */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat, type);
              const isSelected = category === cat;
              const categoryColor = getCategoryColor(cat, type);
              
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryItem,
                    { 
                      backgroundColor: isSelected ? categoryColor : colors.background,
                      borderColor: isSelected ? categoryColor : colors.border
                    }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <IconComponent 
                    size={20} 
                    color={isSelected ? '#fff' : categoryColor} 
                  />
                  <Text style={[
                    styles.categoryText,
                    { color: isSelected ? '#fff' : colors.text }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && <Text style={[styles.errorText, { color: colors.error }]}>{errors.category}</Text>}
        </View>

        {/* Notes Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Notes</Text>
          <TextInput
            style={[styles.textAreaInput, { color: colors.text, borderColor: colors.border }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Date Display */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
          <View style={[styles.dateContainer, { borderColor: colors.border }]}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(date)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: colors.primary, opacity: buttonOpacity }
            ]}
            onPress={handleUpdate}
            disabled={buttonDisabled}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Updating...' : 'Update Transaction'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: colors.error, opacity: buttonOpacity }
            ]}
            onPress={handleDelete}
            disabled={buttonDisabled}
          >
            <Text style={styles.deleteButtonText}>Delete Transaction</Text>
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
              Transaction updated successfully!
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
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  typeContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textAreaInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
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

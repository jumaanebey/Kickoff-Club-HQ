import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton } from '../../components/animations';
import { Toast, showToast } from '../../components/Toast';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast(setToasts, 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      showToast(setToasts, error.message || 'Failed to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo/Header */}
        <View style={styles.header}>
          <Ionicons name="american-football" size={64} color={COLORS.primary} />
          <Text style={styles.title}>Kickoff Club HQ</Text>
          <Text style={styles.subtitle}>Learn football the fun way</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <AnimatedButton onPress={() => setShowPassword(!showPassword)} hapticFeedback={false}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </AnimatedButton>
          </View>

          <AnimatedButton
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </AnimatedButton>

          <AnimatedButton
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </AnimatedButton>
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <AnimatedButton onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </AnimatedButton>
        </View>
      </KeyboardAvoidingView>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
});

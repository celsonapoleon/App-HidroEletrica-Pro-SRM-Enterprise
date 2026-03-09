/**
 * LoginScreen - Tela de Login Corporativa
 * 
 * Características:
 * - UI corporativa com paleta azul/cinza/branco
 * - Validação de email e senha
 * - Tratamento de erros
 * - Loading state
 * - Link para registro
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/screen-container';
import { TextInput } from '@/src/components/ui/TextInput';
import { Button } from '@/src/components/ui/Button';
import { useColors } from '@/hooks/use-colors';
import { authService } from '@/src/services/authService';
import { useAuth } from '@/src/hooks/useAuth';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

/**
 * Tela de Login com validação e tratamento de erros
 */
export function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const colors = useColors();
  const { isLoading } = useAuth();

  // Estado do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Fazer login
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      await authService.login({
        email: email.trim(),
        password,
      });

      // Sucesso - redirecionamento é feito automaticamente pelo AuthContext
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Erro ao fazer login. Tente novamente.',
      });
      Alert.alert('Erro de Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <MaterialIcons name="hourglass-empty" size={48} color={colors.primary} />
        <Text className="text-foreground text-lg font-semibold mt-4">
          Verificando autenticação...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScreenContainer className="justify-between">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcons name="security" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-foreground">
              HidroElétrica Pro
            </Text>
            <Text className="text-sm text-muted mt-2">
              Sistema de Gerenciamento de Fornecedores
            </Text>
          </View>

          {/* Erro geral */}
          {errors.submit && (
            <View className="bg-error/10 border border-error rounded-lg p-3 mb-6">
              <Text className="text-error text-sm font-medium">
                {errors.submit}
              </Text>
            </View>
          )}

          {/* Formulário */}
          <View className="gap-4">
            <TextInput
              label="Email Corporativo"
              placeholder="seu.email@empresa.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              icon="lock"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              editable={!loading}
            />
          </View>

          {/* Esqueci senha */}
          <TouchableOpacity className="mt-4 mb-6">
            <Text className="text-primary text-sm font-medium">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <Button
            label="Entrar no Sistema"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleLogin}
            icon="login"
            iconPosition="right"
          />

          {/* Divisor */}
          <View className="flex-row items-center my-6 gap-3">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <Text className="text-muted text-sm">Novo usuário?</Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </View>

          {/* Botão Registro */}
          <Button
            label="Solicitar Acesso"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={onSwitchToRegister}
            icon="person-add"
            iconPosition="right"
          />
        </ScrollView>

        {/* Footer */}
        <View className="pt-6 border-t" style={{ borderTopColor: colors.border }}>
          <Text className="text-xs text-muted text-center">
            © 2026 HidroElétrica Pro. Todos os direitos reservados.
          </Text>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

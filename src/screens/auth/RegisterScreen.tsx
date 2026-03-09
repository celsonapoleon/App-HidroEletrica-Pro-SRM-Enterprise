/**
 * RegisterScreen - Tela de Registro (Solicitar Acesso)
 * 
 * Características:
 * - Seleção obrigatória de perfil (Strategic Sourcing / Vendor)
 * - Validação de dados corporativos
 * - Criação de usuário no Firebase Auth
 * - Sincronização com Firestore (internal_users)
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
import { UserRole } from '@/src/types';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'buyer',
    label: 'Strategic Sourcing',
    description: 'Gerenciar fornecedores e abrir RFQs',
    icon: 'shopping-cart',
  },
  {
    id: 'vendor',
    label: 'Key Account Manager',
    description: 'Enviar propostas e gerenciar compliance',
    icon: 'business',
  },
];

/**
 * Tela de Registro com seleção de perfil
 */
export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const colors = useColors();

  // Estado do formulário
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    if (!selectedRole) {
      newErrors.role = 'Selecione seu perfil corporativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Fazer registro
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole!,
        department: selectedRole === 'buyer' ? 'Strategic Sourcing' : 'Vendor Management',
      });

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Você será redirecionado para o dashboard.'
      );
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Erro ao criar conta. Tente novamente.',
      });
      Alert.alert('Erro no Registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScreenContainer className="justify-between">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcons name="person-add" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              Solicitar Acesso
            </Text>
            <Text className="text-sm text-muted mt-2 text-center">
              Crie sua conta corporativa no HidroElétrica Pro
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
              label="Nome Completo"
              placeholder="Seu nome completo"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              icon="person"
              editable={!loading}
            />

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              icon="lock"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              editable={!loading}
            />

            <TextInput
              label="Confirmar Senha"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              icon="lock"
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              editable={!loading}
            />
          </View>

          {/* Seleção de Perfil */}
          <View className="mt-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Selecione seu Perfil Corporativo
            </Text>
            {errors.role && (
              <Text className="text-xs font-medium text-error mb-2">
                {errors.role}
              </Text>
            )}
            <View className="gap-3">
              {ROLE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedRole(option.id)}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 flex-row items-start gap-3 ${
                    selectedRole === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-surface'
                  }`}
                >
                  <View
                    className="w-6 h-6 rounded-full border-2 items-center justify-center mt-1"
                    style={{
                      borderColor: selectedRole === option.id ? colors.primary : colors.border,
                      backgroundColor: selectedRole === option.id ? colors.primary : 'transparent',
                    }}
                  >
                    {selectedRole === option.id && (
                      <MaterialIcons name="check" size={14} color="white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {option.label}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {option.description}
                    </Text>
                  </View>
                  <MaterialIcons name={option.icon} size={24} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Termos */}
          <View className="mt-6 mb-6">
            <Text className="text-xs text-muted text-center">
              Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade
            </Text>
          </View>

          {/* Botão Registro */}
          <Button
            label="Criar Conta"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleRegister}
            icon="check-circle"
            iconPosition="right"
          />

          {/* Link Login */}
          <View className="flex-row justify-center gap-1 mt-4">
            <Text className="text-muted text-sm">Já tem uma conta?</Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text className="text-primary text-sm font-semibold">Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

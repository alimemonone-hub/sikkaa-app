import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { 
  Lock, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Zap, 
  Fingerprint, 
  Database
} from 'lucide-react-native';

const LoginScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Database color="#7c5cfc" size={40} />
              </View>
              {/* Corner markers */}
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
            </View>
            
            <Text style={styles.brandTitle}>SIKKA INVESTMENT</Text>
            <View style={styles.versionContainer}>
              <View style={styles.versionLine} />
              <Text style={styles.versionText}>ASSET TERMINAL V4.0</Text>
              <View style={styles.versionLine} />
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.authTitle}>WELCOME BACK</Text>
              <View style={styles.secureBadge}>
                <Text style={styles.secureText}>SECURE_NODE</Text>
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ID // PHONE</Text>
              <View style={styles.inputWrapper}>
                <Smartphone color="#5b5b66" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 890"
                  placeholderTextColor="#4a4a55"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TouchableOpacity> 
                  <Text style={styles.recoveryText}>RECOVERY?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Lock color="#5b5b66" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#4a4a55"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff color="#5b5b66" size={20} />
                  ) : (
                    <Eye color="#5b5b66" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Initialize Button */}
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.buttonText}>INITIALIZE</Text>
              <Zap color="#fff" size={20} fill="#fff" />
            </TouchableOpacity>

            {/* Alt Methods Section */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ALT METHODS</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.altButtonsRow}>
              <TouchableOpacity style={styles.altButton}>
                <Fingerprint color="#a1a1aa" size={20} />
                <Text style={styles.altButtonText}>BIOMETRIC</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.altButton}>
                <Database color="#a1a1aa" size={20} />
                <Text style={styles.altButtonText}>VAULT</Text>
              </TouchableOpacity>
            </View>
            
            {/* Design Corner Marker */}
            <View style={[styles.cornerSmall, styles.bottomRight]} />
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <Text style={styles.footerBaseText}>No access code? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.createAccountText}>Create Account</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.legalLinks}>
              <TouchableOpacity><Text style={styles.legalText}>PRIVACY</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.legalText}>TERMS</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c1b',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#2d254d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7c5cfc',
    shadowColor: '#7c5cfc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  versionLine: {
    width: 20,
    height: 1,
    backgroundColor: '#5b5b66',
  },
  versionText: {
    fontSize: 12,
    color: '#7c5cfc',
    marginHorizontal: 8,
    letterSpacing: 3,
    fontWeight: '500',
  },
  formCard: {
    width: '100%',
    backgroundColor: '#1d1929',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2d254d',
    position: 'relative',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  secureBadge: {
    backgroundColor: '#141120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2d254d',
  },
  secureText: {
    fontSize: 10,
    color: '#7c5cfc',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    letterSpacing: 2,
    marginBottom: 12,
    fontWeight: '600',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recoveryText: {
    fontSize: 10,
    color: '#7c5cfc',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141120',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d254d',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#7c5cfc',
    height: 64,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#7c5cfc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2d254d',
  },
  dividerText: {
    fontSize: 10,
    color: '#5b5b66',
    marginHorizontal: 12,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  altButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  altButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141120',
    borderWidth: 1,
    borderColor: '#2d254d',
    borderRadius: 8,
    paddingVertical: 14,
  },
  altButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 1,
  },
  cornerSmall: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#7c5cfc',
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  footerBaseText: {
    color: '#fff',
    fontSize: 14,
  },
  createAccountText: {
    color: '#7c5cfc',
    fontSize: 14,
    fontWeight: '600',
  },
  legalLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  legalText: {
    fontSize: 12,
    color: '#5b5b66',
    letterSpacing: 2,
    fontWeight: '500',
  },
});

export default LoginScreen;
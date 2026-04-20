import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.bg');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await login(email, password); }
    catch (e: any) { Alert.alert('Грешка', e.message); }
    finally { setBusy(false); }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Вход</Text>
      <TextInput style={s.input} placeholder="Имейл" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Парола" secureTextEntry
        value={password} onChangeText={setPassword} />
      <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
        <Text style={s.btnText}>{busy ? '...' : 'Влез'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>Нямате акаунт? Регистрирайте се.</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#1F3864', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 16, color: '#2E75B6' },
});

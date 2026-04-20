import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await register({ full_name, email, password, role }); }
    catch (e: any) { Alert.alert('Грешка', e.message); }
    finally { setBusy(false); }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Регистрация</Text>
      <TextInput style={s.input} placeholder="Пълно име" value={full_name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Имейл" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Парола (мин. 6 символа)" secureTextEntry
        value={password} onChangeText={setPassword} />
      <View style={s.row}>
        <TouchableOpacity style={[s.roleBtn, role === 'user' && s.roleActive]} onPress={() => setRole('user')}>
          <Text style={role === 'user' ? s.roleTextActive : s.roleText}>Потребител</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.roleBtn, role === 'organizer' && s.roleActive]} onPress={() => setRole('organizer')}>
          <Text style={role === 'organizer' ? s.roleTextActive : s.roleText}>Организатор</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
        <Text style={s.btnText}>{busy ? '...' : 'Създай акаунт'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={s.link}>Назад към вход</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  roleActive: { backgroundColor: '#1F3864', borderColor: '#1F3864' },
  roleText: { color: '#333' },
  roleTextActive: { color: '#fff', fontWeight: '600' },
  btn: { backgroundColor: '#1F3864', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 16, color: '#2E75B6' },
});

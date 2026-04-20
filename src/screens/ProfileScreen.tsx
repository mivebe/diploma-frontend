import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <View style={s.wrap}>
      <Text style={s.name}>{user.full_name}</Text>
      <Text style={s.meta}>{user.email}</Text>
      <Text style={s.meta}>Роля: {user.role === 'organizer' ? 'Организатор' : 'Потребител'}</Text>
      <TouchableOpacity style={s.btn} onPress={logout}>
        <Text style={s.btnText}>Изход</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  meta: { color: '#555', textAlign: 'center', marginBottom: 4 },
  btn: { backgroundColor: '#a00', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

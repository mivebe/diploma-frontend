import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { api } from '../api/client';

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startAt, setStartAt] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [capacity, setCapacity] = useState('20');

  const submit = async () => {
    try {
      if (!title || !startAt || !capacity) {
        Alert.alert('Грешка', 'Моля, попълнете заглавие, дата и капацитет.');
        return;
      }
      await api.createEvent({
        title,
        description: description || undefined,
        location: location || undefined,
        start_at: new Date(startAt).toISOString(),
        capacity: Number(capacity),
      });
      Alert.alert('Готово', 'Събитието е създадено.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Грешка', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.label}>Заглавие *</Text>
      <TextInput style={s.input} value={title} onChangeText={setTitle} />

      <Text style={s.label}>Описание</Text>
      <TextInput style={[s.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />

      <Text style={s.label}>Място</Text>
      <TextInput style={s.input} value={location} onChangeText={setLocation} />

      <Text style={s.label}>Начало (YYYY-MM-DDTHH:MM) *</Text>
      <TextInput style={s.input} value={startAt} onChangeText={setStartAt} autoCapitalize="none" />

      <Text style={s.label}>Капацитет *</Text>
      <TextInput style={s.input} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />

      <TouchableOpacity style={s.btn} onPress={submit}>
        <Text style={s.btnText}>Създай събитие</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: '#fff' },
  label: { marginTop: 10, marginBottom: 4, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  btn: { backgroundColor: '#1F3864', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

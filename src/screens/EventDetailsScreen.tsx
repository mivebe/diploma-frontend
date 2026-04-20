import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function EventDetailsScreen({ route }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);

  const load = useCallback(async () => { setEvent(await api.getEvent(id)); }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const reserve = async () => {
    try {
      await api.reserve(id, 1);
      Alert.alert('Готово', 'Резервацията е направена.');
      load();
    } catch (e: any) {
      const msg = e.message === 'NO_SEATS_AVAILABLE' ? 'Няма свободни места.'
                : e.message === 'ALREADY_RESERVED' ? 'Вече имате резервация за това събитие.'
                : e.message;
      Alert.alert('Грешка', msg);
    }
  };

  if (!event) return <View style={s.wrap}><Text>Зарежда се...</Text></View>;

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>{event.title}</Text>
      <Text style={s.meta}>🗓 {new Date(event.start_at).toLocaleString('bg-BG')}</Text>
      {event.location ? <Text style={s.meta}>📍 {event.location}</Text> : null}
      <Text style={s.meta}>Организатор: {event.organizer_name}</Text>
      <Text style={s.seats}>Свободни места: {event.available_seats} / {event.capacity}</Text>
      {event.description ? <Text style={s.desc}>{event.description}</Text> : null}

      {user?.role === 'user' && event.available_seats > 0 && (
        <TouchableOpacity style={s.btn} onPress={reserve}>
          <Text style={s.btnText}>Резервирай място</Text>
        </TouchableOpacity>
      )}
      {event.available_seats === 0 && (
        <Text style={{ textAlign: 'center', color: '#a00', marginTop: 16 }}>Събитието е запълнено.</Text>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  meta: { color: '#444', marginBottom: 4 },
  seats: { marginTop: 12, color: '#1F3864', fontWeight: '700' },
  desc: { marginTop: 16, lineHeight: 22, color: '#333' },
  btn: { backgroundColor: '#1F3864', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

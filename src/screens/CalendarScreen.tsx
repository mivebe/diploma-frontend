import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

export default function CalendarScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>('');

  const load = useCallback(async () => {
    const list = await api.listEvents();
    setEvents(list);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const marked: any = {};
  events.forEach(e => {
    const day = new Date(e.start_at).toISOString().slice(0, 10);
    marked[day] = { marked: true, dotColor: '#1F3864' };
  });
  if (selected) marked[selected] = { ...(marked[selected] || {}), selected: true, selectedColor: '#1F3864' };

  const dayEvents = events.filter(e => new Date(e.start_at).toISOString().slice(0, 10) === selected);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Calendar markedDates={marked} onDayPress={(d: any) => setSelected(d.dateString)} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {selected ? (
          dayEvents.length ? dayEvents.map(e => (
            <TouchableOpacity key={e.id} style={s.card} onPress={() => navigation.navigate('EventDetails', { id: e.id })}>
              <Text style={s.title}>{e.title}</Text>
              <Text style={s.meta}>{new Date(e.start_at).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          )) : <Text style={{ textAlign: 'center', color: '#888' }}>Няма събития на избраната дата.</Text>
        ) : <Text style={{ textAlign: 'center', color: '#888' }}>Изберете дата в календара.</Text>}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 2 },
});

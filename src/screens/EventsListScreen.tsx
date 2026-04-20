import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

export default function EventsListScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await api.listEvents()); }
    catch {} finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={events}
      keyExtractor={(e) => String(e.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Няма предстоящи събития.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => navigation.navigate('EventDetails', { id: item.id })}>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.meta}>{new Date(item.start_at).toLocaleString('bg-BG')}</Text>
          {item.location ? <Text style={s.meta}>📍 {item.location}</Text> : null}
          <Text style={s.seats}>Свободни места: {item.available_seats} / {item.capacity}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12,
          borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  meta: { color: '#666', marginBottom: 2 },
  seats: { marginTop: 8, color: '#1F3864', fontWeight: '600' },
});

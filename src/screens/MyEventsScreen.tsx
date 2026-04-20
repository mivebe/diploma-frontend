import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

export default function MyEventsScreen({ navigation }: any) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myEvents()); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        data={rows}
        keyExtractor={(e) => String(e.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Нямате създадени събития.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('EventDetails', { id: item.id })}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.meta}>{new Date(item.start_at).toLocaleString('bg-BG')}</Text>
            <Text style={s.meta}>Резервации: {item.reservations_count} / {item.capacity}</Text>
            <Text style={[s.meta, { color: item.status === 'cancelled' ? '#a00' : '#080' }]}>
              Статус: {item.status === 'active' ? 'активно' : 'отменено'}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  meta: { color: '#555', marginBottom: 2 },
  fab: { position: 'absolute', right: 20, bottom: 24, backgroundColor: '#1F3864',
         width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});

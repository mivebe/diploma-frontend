import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';

export default function MyReservationsScreen() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await api.myReservations()); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const cancel = (id: number) => {
    Alert.alert('Отказ', 'Сигурни ли сте, че желаете да откажете резервацията?', [
      { text: 'Не' },
      { text: 'Да', style: 'destructive', onPress: async () => {
          await api.cancelReservation(id); load();
      }}
    ]);
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={rows}
      keyExtractor={(r) => String(r.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Нямате резервации.</Text>}
      renderItem={({ item }) => (
        <View style={[s.card, item.status === 'cancelled' && { opacity: 0.5 }]}>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.meta}>{new Date(item.start_at).toLocaleString('bg-BG')}</Text>
          {item.location ? <Text style={s.meta}>📍 {item.location}</Text> : null}
          <Text style={s.meta}>Места: {item.seats} · Статус: {item.status === 'confirmed' ? 'потвърдена' : 'отказана'}</Text>
          {item.status === 'confirmed' && (
            <TouchableOpacity style={s.cancelBtn} onPress={() => cancel(item.id)}>
              <Text style={{ color: '#a00', fontWeight: '600' }}>Откажи резервация</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  meta: { color: '#555', marginBottom: 2 },
  cancelBtn: { marginTop: 10 },
});

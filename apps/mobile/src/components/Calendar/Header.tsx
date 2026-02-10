import { Pressable, StyleSheet, Text, View } from 'react-native';
import { startOfMonth, add, format } from 'date-fns';

type HeaderProps = {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const Header = ({ date, onDateChange }: HeaderProps) => {
  const prevMonth = () => {
    onDateChange(startOfMonth(add(date, { months: -1 })));
  }

  const nextMonth = () => {
    onDateChange(startOfMonth(add(date, { months: 1 })));
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={prevMonth}>
        <Text>Prev</Text>
      </Pressable>
      <Text style={{ marginHorizontal: 20, fontWeight: 'bold' }}>{format(date, 'MMMM yyyy')}</Text>
      <Pressable style={styles.button} onPress={nextMonth}>
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' },
  button: { borderWidth: 1, padding: 10, borderRadius: 5 },
});
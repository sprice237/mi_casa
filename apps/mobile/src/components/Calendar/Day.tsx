import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DispatchWithoutAction } from 'react';
import { UTCDate } from '@date-fns/utc';

type DayBoxProps = {
  date: UTCDate | null;
  isSelected?: boolean;
  onPress?: DispatchWithoutAction;
  hasIndicator?: boolean;
}

export const DayBox = ({ date, isSelected, onPress, hasIndicator }: DayBoxProps) => {
  const content = (
    <View style={[styles.day, isSelected ? styles.selected : null]}>
      <View style={styles.dayNumberContainer}>
        {date !== null ? <Text>{date.getDate()}</Text> : null}
      </View>
      {hasIndicator && (
        <View style={styles.indicator} />
      )}
    </View>
  )

  return date ? (
    <Pressable style={styles.day} onPress={onPress}>
      {content}
    </Pressable>
  ) : content
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  week: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  day: {
    flex: 1,
    position: 'relative',
  },
  dayNumberContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: 'lightblue',
  },
  indicator: { position: "absolute", top: 5, right: 5, width: 10, height: 10, borderRadius: 10000, backgroundColor: 'red' }
});
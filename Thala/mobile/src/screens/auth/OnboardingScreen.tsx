import React, { useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'thala.hasOnboarded';

const slides: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  gradient: [string, string];
}[] = [
  {
    icon: 'run-fast',
    title: 'Track every run, ride & walk',
    subtitle: 'Live GPS routes, pace, distance and calories - all captured automatically.',
    gradient: ['#0f8a58', '#1aa76c'],
  },
  {
    icon: 'food-apple-outline',
    title: 'Personalized nutrition & AI coaching',
    subtitle: 'Get a daily diet plan built from your BMI, goals and activity, plus smart coaching tips.',
    gradient: ['#0d6e48', '#0f8a58'],
  },
  {
    icon: 'trophy-outline',
    title: 'Compete, achieve, connect',
    subtitle: 'Unlock badges, join challenges, climb leaderboards and share your progress.',
    gradient: ['#0d4832', '#0d6e48'],
  },
];

export function OnboardingScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Onboarding'>) {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Login');
  };

  const next = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      finish();
    }
  };

  return (
    <LinearGradient colors={slides[index].gradient} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.skipRow}>
          <Text onPress={finish} style={styles.skip}>
            Skip
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
        >
          {slides.map((slide, i) => (
            <View key={slide.title} style={[styles.slide, { width }]}>
              <View style={styles.lottieWrap}>
                <LottieView source={require('../../../assets/lottie/pulse.json')} autoPlay loop style={styles.lottie} />
                <MaterialCommunityIcons name={slide.icon} size={64} color="#fff" style={styles.icon} />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {slides.map((slide, i) => (
            <View key={slide.title} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.footer}>
          <Button mode="contained" buttonColor="#ffffff" textColor={slides[index].gradient[0]} onPress={next}>
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export { ONBOARDING_KEY };

const styles = StyleSheet.create({
  flex: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 8 },
  skip: { color: '#ffffffcc', fontSize: 14, fontWeight: '600' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  lottieWrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  lottie: { width: 220, height: 220, position: 'absolute' },
  icon: { position: 'absolute' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginTop: 24 },
  subtitle: { fontSize: 15, color: '#ffffffdd', textAlign: 'center', marginTop: 12, lineHeight: 22 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff55' },
  dotActive: { backgroundColor: '#ffffff', width: 20 },
  footer: { paddingHorizontal: 32, paddingBottom: 24 },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { FormTextInput } from '@/components/FormTextInput';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateMe } from '@/api/users';
import { updateUser } from '@/features/auth/authSlice';
import type { RootStackParamList } from '@/navigation/types';
import type { ExperienceLevel, FitnessGoal, Gender, User } from '@/types/models';

interface FormValues {
  name: string;
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  medicalConditions: string;
}

export function EditProfileScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'EditProfile'>) {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? '',
      age: user?.age ? String(user.age) : '',
      heightCm: user?.heightCm ? String(user.heightCm) : '',
      weightKg: user?.weightKg ? String(user.weightKg) : '',
      targetWeightKg: user?.targetWeightKg ? String(user.targetWeightKg) : '',
      medicalConditions: user?.medicalConditions?.join(', ') ?? '',
    },
  });

  const [gender, setGender] = React.useState<Gender>(user?.gender ?? 'male');
  const [goal, setGoal] = React.useState<FitnessGoal>(user?.fitnessGoal ?? 'maintenance');
  const [level, setLevel] = React.useState<ExperienceLevel>(user?.experienceLevel ?? 'beginner');

  const weight = Number(watch('weightKg')) || 0;
  const height = Number(watch('heightCm')) || 0;
  const bmi = height > 0 ? weight / ((height / 100) * (height / 100)) : 0;

  const mutation = useMutation({
    mutationFn: (updates: Partial<User>) => updateMe(updates),
    onSuccess: (updated) => {
      dispatch(updateUser(updated));
      queryClient.invalidateQueries();
      Toast.show({ type: 'success', text1: 'Profile updated' });
      navigation.goBack();
    },
    onError: () => Toast.show({ type: 'error', text1: 'Could not update profile' }),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      name: values.name,
      age: values.age ? Number(values.age) : undefined,
      heightCm: values.heightCm ? Number(values.heightCm) : undefined,
      weightKg: values.weightKg ? Number(values.weightKg) : undefined,
      targetWeightKg: values.targetWeightKg ? Number(values.targetWeightKg) : undefined,
      gender,
      fitnessGoal: goal,
      experienceLevel: level,
      medicalConditions: values.medicalConditions
        ? values.medicalConditions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>

      <FormTextInput control={control} name="name" label="Full name" />
      <View style={styles.rowInputs}>
        <View style={{ flex: 1 }}>
          <FormTextInput control={control} name="age" label="Age" keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <FormTextInput control={control} name="heightCm" label="Height (cm)" keyboardType="number-pad" />
        </View>
      </View>
      <View style={styles.rowInputs}>
        <View style={{ flex: 1 }}>
          <FormTextInput control={control} name="weightKg" label="Weight (kg)" keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <FormTextInput control={control} name="targetWeightKg" label="Target weight (kg)" keyboardType="number-pad" />
        </View>
      </View>

      {bmi > 0 && (
        <Text style={[styles.bmiPreview, { color: colors.primary }]}>Current BMI: {bmi.toFixed(1)}</Text>
      )}

      <Text style={[styles.label, { color: colors.textMuted }]}>Gender</Text>
      <SegmentedButtons
        value={gender}
        onValueChange={(v) => setGender(v as Gender)}
        buttons={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ]}
        style={styles.segment}
      />

      <Text style={[styles.label, { color: colors.textMuted }]}>Fitness Goal</Text>
      <SegmentedButtons
        value={goal}
        onValueChange={(v) => setGoal(v as FitnessGoal)}
        buttons={[
          { value: 'weight_loss', label: 'Lose' },
          { value: 'muscle_gain', label: 'Muscle' },
          { value: 'maintenance', label: 'Maintain' },
        ]}
        style={styles.segment}
      />

      <Text style={[styles.label, { color: colors.textMuted }]}>Experience Level</Text>
      <SegmentedButtons
        value={level}
        onValueChange={(v) => setLevel(v as ExperienceLevel)}
        buttons={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ]}
        style={styles.segment}
      />

      <FormTextInput control={control} name="medicalConditions" label="Medical conditions (comma separated)" multiline />

      <Button mode="contained" loading={mutation.isPending} onPress={handleSubmit(onSubmit)} style={styles.button}>
        Save Changes
      </Button>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  rowInputs: { flexDirection: 'row', gap: 12 },
  bmiPreview: { fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 6, marginTop: 4, fontWeight: '600' },
  segment: { marginBottom: 12 },
  button: { marginTop: 16, marginBottom: 24, borderRadius: 12 },
});

import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { db } from './db';
import {
  Achievement,
  ActivitySession,
  Challenge,
  DailyActivity,
  Exercise,
  HeartRateEntry,
  Post,
  Sport,
  User,
  Workout,
} from '../types/models';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function dateOnly(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function seedDatabase() {
  if (db.users.length > 0) return; // already seeded

  const now = new Date().toISOString();

  // ---- Users ----
  const demoPasswordHash = await bcrypt.hash('Demo@1234', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);

  const demoUser: User = {
    id: uuid(),
    name: 'Arjun Sharma',
    email: 'demo@thala.app',
    phone: '+919876543210',
    passwordHash: demoPasswordHash,
    photoUrl: 'https://i.pravatar.cc/300?img=12',
    age: 27,
    heightCm: 175,
    weightKg: 72,
    targetWeightKg: 68,
    gender: 'male',
    fitnessGoal: 'fat_loss',
    experienceLevel: 'intermediate',
    medicalConditions: [],
    role: 'user',
    provider: 'password',
    isEmailVerified: true,
    tokenVersion: 0,
    createdAt: daysAgoIso(120),
    updatedAt: now,
  };

  const adminUser: User = {
    id: uuid(),
    name: 'Thala Admin',
    email: 'admin@thala.app',
    passwordHash: adminPasswordHash,
    photoUrl: 'https://i.pravatar.cc/300?img=5',
    gender: 'other',
    role: 'admin',
    provider: 'password',
    isEmailVerified: true,
    tokenVersion: 0,
    createdAt: daysAgoIso(200),
    updatedAt: now,
  };

  const secondUser: User = {
    id: uuid(),
    name: 'Priya Nair',
    email: 'priya@thala.app',
    passwordHash: demoPasswordHash,
    photoUrl: 'https://i.pravatar.cc/300?img=32',
    age: 24,
    heightCm: 162,
    weightKg: 58,
    gender: 'female',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'beginner',
    role: 'user',
    provider: 'password',
    isEmailVerified: true,
    tokenVersion: 0,
    createdAt: daysAgoIso(60),
    updatedAt: now,
  };

  db.users.push(demoUser, adminUser, secondUser);

  // ---- Exercises ----
  const categories: Exercise['category'][] = ['chest', 'legs', 'back', 'arms', 'shoulder', 'core', 'cardio', 'yoga'];
  const exerciseNames: Record<Exercise['category'], string[]> = {
    chest: ['Push Ups', 'Bench Press', 'Incline Dumbbell Press', 'Chest Fly'],
    legs: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises'],
    back: ['Pull Ups', 'Deadlift', 'Bent Over Row', 'Lat Pulldown'],
    arms: ['Bicep Curl', 'Tricep Dips', 'Hammer Curl', 'Skull Crushers'],
    shoulder: ['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Arnold Press'],
    core: ['Plank', 'Russian Twist', 'Crunches', 'Hanging Leg Raise'],
    cardio: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees'],
    yoga: ['Sun Salutation', 'Downward Dog', 'Warrior Pose', 'Child Pose'],
  };

  categories.forEach((category) => {
    exerciseNames[category].forEach((name, idx) => {
      const exercise: Exercise = {
        id: uuid(),
        name,
        category,
        level: idx % 3 === 0 ? 'beginner' : idx % 3 === 1 ? 'intermediate' : 'advanced',
        mediaUrl: `https://media.thala.app/exercises/${category}-${idx + 1}.gif`,
        description: `${name} is an effective ${category} exercise that builds strength and endurance when performed with correct form.`,
        sets: 3 + (idx % 2),
        reps: category === 'core' || category === 'yoga' ? '30-45 sec' : `${8 + idx * 2}-${12 + idx * 2}`,
        restTimeSeconds: 45 + idx * 15,
        caloriesBurned: 6 + idx * 2,
      };
      db.exercises.push(exercise);
    });
  });

  // ---- Workouts (grouped exercise routines) ----
  const levels: Workout['level'][] = ['beginner', 'intermediate', 'advanced'];
  levels.forEach((level) => {
    categories.forEach((category) => {
      const exIds = db.exercises.filter((e) => e.category === category).map((e) => e.id);
      const workout: Workout = {
        id: uuid(),
        name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)} Blast`,
        level,
        category,
        exerciseIds: exIds,
        durationMinutes: level === 'beginner' ? 20 : level === 'intermediate' ? 35 : 50,
        caloriesBurned: level === 'beginner' ? 150 : level === 'intermediate' ? 280 : 420,
        imageUrl: `https://media.thala.app/workouts/${category}-${level}.jpg`,
        description: `A ${level} level workout focused on ${category} using ${exIds.length} targeted exercises.`,
      };
      db.workouts.push(workout);
    });
  });

  // ---- Sports ----
  const sportsData: Omit<Sport, 'id'>[] = [
    {
      name: 'Running',
      icon: 'run',
      imageUrl: 'https://media.thala.app/sports/running.jpg',
      trainingPlans: [
        { title: 'Couch to 5K', durationWeeks: 8, description: 'Beginner-friendly plan to run 5K without stopping.' },
        { title: '10K Improver', durationWeeks: 6, description: 'Build speed and endurance to a strong 10K.' },
      ],
      caloriesBurnedPerHour: 600,
      tips: ['Warm up with dynamic stretches', 'Land mid-foot, not on your heel', 'Increase distance by max 10%/week'],
      injuryPrevention: ['Stretch calves and hamstrings', 'Replace shoes every 500-800km', 'Rest between hard sessions'],
    },
    {
      name: 'Cricket',
      icon: 'cricket',
      imageUrl: 'https://media.thala.app/sports/cricket.jpg',
      trainingPlans: [{ title: 'Batting Fundamentals', durationWeeks: 4, description: 'Footwork and shot selection drills.' }],
      caloriesBurnedPerHour: 350,
      tips: ['Keep your eye on the ball', 'Practice throwing accuracy daily'],
      injuryPrevention: ['Warm up shoulders before bowling', 'Use proper pads and protection'],
    },
    {
      name: 'Football',
      icon: 'football',
      imageUrl: 'https://media.thala.app/sports/football.jpg',
      trainingPlans: [{ title: 'Endurance & Agility', durationWeeks: 6, description: 'Sprint intervals and ball control drills.' }],
      caloriesBurnedPerHour: 550,
      tips: ['Master both feet for passing', 'Maintain field awareness'],
      injuryPrevention: ['Ankle strengthening exercises', 'Proper cleats for the surface'],
    },
    {
      name: 'Basketball',
      icon: 'basketball',
      imageUrl: 'https://media.thala.app/sports/basketball.jpg',
      trainingPlans: [{ title: 'Vertical Jump Program', durationWeeks: 5, description: 'Plyometrics for explosive jumping.' }],
      caloriesBurnedPerHour: 500,
      tips: ['Practice free throws daily', 'Box out for rebounds'],
      injuryPrevention: ['Ankle braces for landing', 'Knee strengthening drills'],
    },
    {
      name: 'Volleyball',
      icon: 'volleyball',
      imageUrl: 'https://media.thala.app/sports/volleyball.jpg',
      trainingPlans: [{ title: 'Spike & Serve Clinic', durationWeeks: 4, description: 'Approach timing and serve accuracy.' }],
      caloriesBurnedPerHour: 400,
      tips: ['Communicate with teammates', 'Keep knees bent while receiving'],
      injuryPrevention: ['Finger taping for blocking', 'Shoulder mobility work'],
    },
    {
      name: 'Cycling',
      icon: 'bike',
      imageUrl: 'https://media.thala.app/sports/cycling.jpg',
      trainingPlans: [{ title: 'Endurance Builder', durationWeeks: 8, description: 'Progressive long rides to build stamina.' }],
      caloriesBurnedPerHour: 500,
      tips: ['Maintain a steady cadence of 80-100rpm', 'Stay hydrated on long rides'],
      injuryPrevention: ['Correct saddle height', 'Wear a certified helmet'],
    },
    {
      name: 'Gym',
      icon: 'dumbbell',
      imageUrl: 'https://media.thala.app/sports/gym.jpg',
      trainingPlans: [{ title: 'Strength Foundations', durationWeeks: 6, description: 'Compound lifts for full-body strength.' }],
      caloriesBurnedPerHour: 450,
      tips: ['Prioritize form over weight', 'Progressive overload weekly'],
      injuryPrevention: ['Always warm up before heavy lifts', 'Use a spotter for max attempts'],
    },
    {
      name: 'Swimming',
      icon: 'swim',
      imageUrl: 'https://media.thala.app/sports/swimming.jpg',
      trainingPlans: [{ title: 'Stroke Technique', durationWeeks: 4, description: 'Freestyle and breathing efficiency drills.' }],
      caloriesBurnedPerHour: 600,
      tips: ['Focus on breathing rhythm', 'Kick from the hips, not knees'],
      injuryPrevention: ['Shoulder mobility warm-up', 'Avoid overtraining the rotator cuff'],
    },
    {
      name: 'Tennis',
      icon: 'tennis',
      imageUrl: 'https://media.thala.app/sports/tennis.jpg',
      trainingPlans: [{ title: 'Groundstroke Mastery', durationWeeks: 5, description: 'Forehand and backhand consistency drills.' }],
      caloriesBurnedPerHour: 480,
      tips: ['Split step before every shot', 'Rotate hips for power'],
      injuryPrevention: ['Forearm strengthening for tennis elbow', 'Proper grip size racquet'],
    },
    {
      name: 'Badminton',
      icon: 'badminton',
      imageUrl: 'https://media.thala.app/sports/badminton.jpg',
      trainingPlans: [{ title: 'Footwork Speed', durationWeeks: 4, description: 'Court movement and reaction drills.' }],
      caloriesBurnedPerHour: 450,
      tips: ['Return to base position after each shot', 'Use wrist snap for smashes'],
      injuryPrevention: ['Ankle support footwear', 'Shoulder stretches pre-match'],
    },
  ];
  sportsData.forEach((s) => db.sports.push({ ...s, id: uuid() }));

  // ---- Activity sessions (last 14 days for demo user) ----
  for (let i = 13; i >= 0; i -= 1) {
    if (i % 2 === 0) {
      const distanceKm = Number((3 + Math.random() * 5).toFixed(2));
      const durationSeconds = Math.round(distanceKm * (300 + Math.random() * 60));
      const session: ActivitySession = {
        id: uuid(),
        userId: demoUser.id,
        type: i % 4 === 0 ? 'running' : 'walking',
        startedAt: daysAgoIso(i),
        endedAt: daysAgoIso(i),
        durationSeconds,
        distanceKm,
        avgPaceMinPerKm: Number((durationSeconds / 60 / distanceKm).toFixed(2)),
        avgSpeedKmh: Number(((distanceKm / durationSeconds) * 3600).toFixed(2)),
        calories: Math.round(distanceKm * 68),
        elevationGainM: Math.round(Math.random() * 80),
        steps: Math.round(distanceKm * 1300),
        route: [
          { latitude: 12.9716, longitude: 77.5946, timestamp: Date.now() - durationSeconds * 1000, speed: 2.5 },
          { latitude: 12.9736, longitude: 77.5966, timestamp: Date.now() - (durationSeconds * 1000) / 2, speed: 2.8 },
          { latitude: 12.9756, longitude: 77.5986, timestamp: Date.now(), speed: 3.0 },
        ],
        createdAt: daysAgoIso(i),
      };
      db.activitySessions.push(session);
    } else {
      const distanceKm = Number((8 + Math.random() * 12).toFixed(2));
      const durationSeconds = Math.round(distanceKm * 150);
      const session: ActivitySession = {
        id: uuid(),
        userId: demoUser.id,
        type: 'cycling',
        startedAt: daysAgoIso(i),
        endedAt: daysAgoIso(i),
        durationSeconds,
        distanceKm,
        avgSpeedKmh: Number(((distanceKm / durationSeconds) * 3600).toFixed(2)),
        calories: Math.round(distanceKm * 28),
        elevationGainM: Math.round(Math.random() * 150),
        route: [
          { latitude: 12.9716, longitude: 77.5946, timestamp: Date.now() - durationSeconds * 1000, speed: 6.5 },
          { latitude: 12.9816, longitude: 77.6046, timestamp: Date.now(), speed: 7.1 },
        ],
        createdAt: daysAgoIso(i),
      };
      db.activitySessions.push(session);
    }
  }

  // ---- Daily activity (28 days) ----
  for (let i = 27; i >= 0; i -= 1) {
    const activity: DailyActivity = {
      id: uuid(),
      userId: demoUser.id,
      date: dateOnly(i),
      steps: 4000 + Math.round(Math.random() * 8000),
      caloriesBurned: 1800 + Math.round(Math.random() * 900),
      waterMl: 1500 + Math.round(Math.random() * 1500),
      sleepHours: Number((5.5 + Math.random() * 3).toFixed(1)),
      exerciseMinutes: Math.round(Math.random() * 90),
      distanceKm: Number((2 + Math.random() * 8).toFixed(2)),
      activeMinutes: Math.round(20 + Math.random() * 80),
    };
    db.dailyActivities.push(activity);
  }

  // ---- Heart rate entries (last 7 days, multiple readings/day) ----
  for (let i = 6; i >= 0; i -= 1) {
    [7, 12, 18, 21].forEach((hour) => {
      const entry: HeartRateEntry = {
        id: uuid(),
        userId: demoUser.id,
        bpm: 60 + Math.round(Math.random() * 45),
        source: Math.random() > 0.5 ? 'device' : 'manual',
        recordedAt: (() => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(hour, 0, 0, 0);
          return d.toISOString();
        })(),
      };
      db.heartRateEntries.push(entry);
    });
  }

  // ---- Diet plan ----
  db.dietPlans.push({
    id: uuid(),
    userId: demoUser.id,
    goal: 'fat_loss',
    bmi: 23.5,
    bmr: 1720,
    dailyCalories: 2200,
    meals: {
      breakfast: ['Oats with banana and almonds', 'Boiled eggs (2)', 'Green tea'],
      lunch: ['Grilled chicken breast (150g)', 'Brown rice (1 cup)', 'Mixed vegetable salad'],
      dinner: ['Grilled fish or paneer', 'Steamed vegetables', 'Quinoa (1/2 cup)'],
      snacks: ['Greek yogurt with berries', 'Handful of almonds', 'Protein shake'],
    },
    waterTargetMl: 3000,
    createdAt: daysAgoIso(5),
  });

  // ---- Achievements ----
  const achievementsData: Omit<Achievement, 'id'>[] = [
    { code: 'first_run', title: 'First Run', description: 'Complete your first tracked run.', icon: 'medal-first-run', criteria: 'Complete 1 running session' },
    { code: 'ten_km', title: '10 KM Club', description: 'Run a total of 10 kilometers.', icon: 'medal-10k', criteria: 'Accumulate 10km running' },
    { code: 'hundred_km', title: '100 KM Club', description: 'Run a total of 100 kilometers.', icon: 'medal-100k', criteria: 'Accumulate 100km running' },
    { code: 'streak_30', title: '30 Day Streak', description: 'Stay active for 30 consecutive days.', icon: 'medal-streak', criteria: '30 consecutive active days' },
    { code: 'steps_10000', title: '10,000 Steps', description: 'Hit 10,000 steps in a single day.', icon: 'medal-steps', criteria: '10000 steps in one day' },
    { code: 'marathon', title: 'Marathon Finisher', description: 'Complete a 42.2km run.', icon: 'medal-marathon', criteria: 'Single run of 42.2km' },
  ];
  achievementsData.forEach((a) => db.achievements.push({ ...a, id: uuid() }));
  db.userAchievements.push({
    id: uuid(),
    userId: demoUser.id,
    achievementId: db.achievements[0].id,
    unlockedAt: daysAgoIso(10),
  });
  db.userAchievements.push({
    id: uuid(),
    userId: demoUser.id,
    achievementId: db.achievements[1].id,
    unlockedAt: daysAgoIso(3),
  });

  // ---- Challenges ----
  const challengesData: Omit<Challenge, 'id'>[] = [
    { title: 'Daily 8K Steps', description: 'Walk at least 8,000 steps today.', frequency: 'daily', targetValue: 8000, unit: 'steps', startDate: dateOnly(0), endDate: dateOnly(0) },
    { title: 'Weekly 25km Runner', description: 'Run a combined 25km this week.', frequency: 'weekly', targetValue: 25, unit: 'km', startDate: dateOnly(6), endDate: dateOnly(0) },
    { title: 'Monthly Consistency', description: 'Log activity on 20 days this month.', frequency: 'monthly', targetValue: 20, unit: 'days', startDate: dateOnly(29), endDate: dateOnly(0) },
  ];
  challengesData.forEach((c) => db.challenges.push({ ...c, id: uuid() }));
  db.challenges.forEach((c) => {
    db.challengeParticipants.push({ id: uuid(), challengeId: c.id, userId: demoUser.id, progress: Math.round(c.targetValue * 0.6), completed: false });
    db.challengeParticipants.push({ id: uuid(), challengeId: c.id, userId: secondUser.id, progress: Math.round(c.targetValue * 0.8), completed: false });
  });

  // ---- Community posts ----
  const postsData: Omit<Post, 'id'>[] = [
    {
      userId: demoUser.id,
      content: 'Crushed a 6.2km run this morning! Feeling great 🏃',
      imageUrl: 'https://media.thala.app/posts/run1.jpg',
      likes: [secondUser.id],
      comments: [{ id: uuid(), userId: secondUser.id, text: 'Awesome pace!', createdAt: daysAgoIso(1) }],
      shares: 2,
      createdAt: daysAgoIso(1),
    },
    {
      userId: secondUser.id,
      content: 'Leg day complete. Squats PR at 80kg!',
      likes: [demoUser.id],
      comments: [],
      shares: 0,
      createdAt: daysAgoIso(2),
    },
  ];
  postsData.forEach((p) => db.posts.push({ ...p, id: uuid() }));
  db.follows.push({ followerId: demoUser.id, followingId: secondUser.id });
  db.follows.push({ followerId: secondUser.id, followingId: demoUser.id });

  // ---- Notifications ----
  db.notifications.push(
    {
      id: uuid(),
      userId: demoUser.id,
      title: 'Time to hydrate!',
      body: 'You are 1.2L behind your daily water goal.',
      type: 'reminder',
      read: false,
      createdAt: daysAgoIso(0),
    },
    {
      id: uuid(),
      userId: demoUser.id,
      title: 'Achievement unlocked',
      body: 'You just earned the "10 KM Club" badge!',
      type: 'achievement',
      read: false,
      createdAt: daysAgoIso(3),
    },
    {
      id: uuid(),
      userId: demoUser.id,
      title: 'Priya started following you',
      body: 'Check out her profile and activity feed.',
      type: 'social',
      read: true,
      createdAt: daysAgoIso(5),
    },
  );

  // eslint-disable-next-line no-console
  console.log(`Seed complete: ${db.users.length} users, ${db.exercises.length} exercises, ${db.workouts.length} workouts, ${db.sports.length} sports`);
}

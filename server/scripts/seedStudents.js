import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const studentRoster = [
  { name: 'Aarav Sharma', email: 'aarav.sharma01@example.com', enrollment: 'MUR2509373' },
  { name: 'Priya Patel', email: 'priya.patel02@example.com', enrollment: 'MUR2509374' },
  { name: 'Rahul Verma', email: 'rahul.verma03@example.com', enrollment: 'MUR2509375' },
  { name: 'Ananya Singh', email: 'ananya.singh04@example.com', enrollment: 'MUR2509376' },
  { name: 'Arjun Mehta', email: 'arjun.mehta05@example.com', enrollment: 'MUR2509377' },
  { name: 'Sneha Gupta', email: 'sneha.gupta06@example.com', enrollment: 'MUR2509378' },
  { name: 'Rohan Joshi', email: 'rohan.joshi07@example.com', enrollment: 'MUR2509379' },
  { name: 'Kavya Mishra', email: 'kavya.mishra08@example.com', enrollment: 'MUR2509380' },
  { name: 'Aditya Jain', email: 'aditya.jain09@example.com', enrollment: 'MUR2509381' },
  { name: 'Ishita Shah', email: 'ishita.shah10@example.com', enrollment: 'MUR2509382' },
  { name: 'Vivek Yadav', email: 'vivek.yadav11@example.com', enrollment: 'MUR2509383' },
  { name: 'Neha Agarwal', email: 'neha.agarwal12@example.com', enrollment: 'MUR2509384' },
  { name: 'Karan Malhotra', email: 'karan.malhotra13@example.com', enrollment: 'MUR2509385' },
  { name: 'Pooja Rathore', email: 'pooja.rathore14@example.com', enrollment: 'MUR2509386' },
  { name: 'Aman Choudhary', email: 'aman.choudhary15@example.com', enrollment: 'MUR2509387' },
  { name: 'Riya Saxena', email: 'riya.saxena16@example.com', enrollment: 'MUR2509388' },
  { name: 'Sahil Kapoor', email: 'sahil.kapoor17@example.com', enrollment: 'MUR2509389' },
  { name: 'Simran Kaur', email: 'simran.kaur18@example.com', enrollment: 'MUR2509390' },
  { name: 'Devansh Tiwari', email: 'devansh.tiwari19@example.com', enrollment: 'MUR2509391' },
  { name: 'Meera Nair', email: 'meera.nair20@example.com', enrollment: 'MUR2509392' },
  { name: 'Yash Kulkarni', email: 'yash.kulkarni21@example.com', enrollment: 'MUR2509393' },
  { name: 'Diya Desai', email: 'diya.desai22@example.com', enrollment: 'MUR2509394' },
  { name: 'Harsh Pandey', email: 'harsh.pandey23@example.com', enrollment: 'MUR2509395' },
  { name: 'Aditi Soni', email: 'aditi.soni24@example.com', enrollment: 'MUR2509396' },
  { name: 'Manish Kumar', email: 'manish.kumar25@example.com', enrollment: 'MUR2509397' },
  { name: 'Tanvi Bansal', email: 'tanvi.bansal26@example.com', enrollment: 'MUR2509398' },
  { name: 'Akash Tripathi', email: 'akash.tripathi27@example.com', enrollment: 'MUR2509399' },
  { name: 'Nisha Kumari', email: 'nisha.kumari28@example.com', enrollment: 'MUR2509400' },
  { name: 'Varun Saini', email: 'varun.saini29@example.com', enrollment: 'MUR2509401' },
  { name: 'Sakshi Rawat', email: 'sakshi.rawat30@example.com', enrollment: 'MUR2509402' },
  { name: 'Krishna Patel', email: 'krishna.patel31@example.com', enrollment: 'MUR2509403' },
  { name: 'Muskan Khan', email: 'muskan.khan32@example.com', enrollment: 'MUR2509404' },
  { name: 'Abhishek Das', email: 'abhishek.das33@example.com', enrollment: 'MUR2509405' },
  { name: 'Shreya Roy', email: 'shreya.roy34@example.com', enrollment: 'MUR2509406' },
  { name: 'Mohit Solanki', email: 'mohit.solanki35@example.com', enrollment: 'MUR2509407' },
  { name: 'Payal Sharma', email: 'payal.sharma36@example.com', enrollment: 'MUR2509408' },
  { name: 'Nikhil Arora', email: 'nikhil.arora37@example.com', enrollment: 'MUR2509409' },
  { name: 'Khushi Jain', email: 'khushi.jain38@example.com', enrollment: 'MUR2509410' },
  { name: 'Saurabh Mishra', email: 'saurabh.mishra39@example.com', enrollment: 'MUR2509411' },
  { name: 'Ira Chawla', email: 'ira.chawla40@example.com', enrollment: 'MUR2509412' },
  { name: 'Rajat Bhardwaj', email: 'rajat.bhardwaj41@example.com', enrollment: 'MUR2509413' },
  { name: 'Palak Goyal', email: 'palak.goyal42@example.com', enrollment: 'MUR2509414' },
  { name: 'Deepak Meena', email: 'deepak.meena43@example.com', enrollment: 'MUR2509415' },
  { name: 'Tanya Mathur', email: 'tanya.mathur44@example.com', enrollment: 'MUR2509416' },
  { name: 'Pranav Dubey', email: 'pranav.dubey45@example.com', enrollment: 'MUR2509417' },
  { name: 'Garima Joshi', email: 'garima.joshi46@example.com', enrollment: 'MUR2509418' },
  { name: 'Ayush Rathore', email: 'ayush.rathore47@example.com', enrollment: 'MUR2509419' },
  { name: 'Bhavna Pareek', email: 'bhavna.pareek48@example.com', enrollment: 'MUR2509420' },
  { name: 'Rishabh Saxena', email: 'rishabh.saxena49@example.com', enrollment: 'MUR2509421' },
  { name: 'Mansi Solanki', email: 'mansi.solanki50@example.com', enrollment: 'MUR2509422' },
  { name: 'Om Prakash', email: 'om.prakash51@example.com', enrollment: 'MUR2509423' },
  { name: 'Sana Sheikh', email: 'sana.sheikh52@example.com', enrollment: 'MUR2509424' },
  { name: 'Gaurav Thakur', email: 'gaurav.thakur53@example.com', enrollment: 'MUR2509425' },
  { name: 'Lavanya Reddy', email: 'lavanya.reddy54@example.com', enrollment: 'MUR2509426' },
  { name: 'Tarun Kumar', email: 'tarun.kumar55@example.com', enrollment: 'MUR2509427' },
  { name: 'Jhanvi Parekh', email: 'jhanvi.parekh56@example.com', enrollment: 'MUR2509428' },
  { name: 'Shivam Bhatt', email: 'shivam.bhatt57@example.com', enrollment: 'MUR2509429' },
  { name: 'Ritika Anand', email: 'ritika.anand58@example.com', enrollment: 'MUR2509430' },
  { name: 'Kunal Sharma', email: 'kunal.sharma59@example.com', enrollment: 'MUR2509431' },
  { name: 'Nandini Verma', email: 'nandini.verma60@example.com', enrollment: 'MUR2509432' },
];

const departments = [
  'Department of Computer Science & Engineering (B.Tech CSE - AI & ML)',
  'Department of Computer Science & Engineering (B.Tech CSE - Data Science)',
  'Department of Computer Science & Engineering (B.Tech CSE - Cyber Security)',
  'Department of Information Technology & Software Systems',
  'Department of Electronics & Communication Engineering',
  'Department of Electrical & Computer Engineering',
  'Department of Robotics & Autonomous Systems',
];

async function seedStudents() {
  console.log('================================================================');
  console.log('🎓 [NextCampus Database Seed] Adding Student Roster to MongoDB...');
  console.log('================================================================');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment!');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB Atlas: ${mongoose.connection.host}`);
    console.log(`📋 Total student records to process: ${studentRoster.length}`);

    // Pre-calculate standard hashed password ('Student@2026')
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Student@2026', salt);

    const enrollmentsCol = mongoose.connection.db.collection('enrollments');
    const usersCol = mongoose.connection.db.collection('users');
    const studentsCol = mongoose.connection.db.collection('students');

    let enrollmentsUpserted = 0;
    let usersUpserted = 0;
    let studentsUpserted = 0;

    for (let i = 0; i < studentRoster.length; i++) {
      const s = studentRoster[i];
      const dept = departments[i % departments.length];
      const normEmail = s.email.toLowerCase().trim();
      const normEnrollment = s.enrollment.toUpperCase().trim();
      const firstName = s.name.split(' ')[0];

      // 1. Upsert into 'enrollments' (official university registrar admissions collection)
      const enrollmentDoc = {
        enrollmentNumber: normEnrollment,
        fullName: s.name,
        email: normEmail,
        department: dept,
        academicYear: 'Class of 2029',
        admissionYear: 2025,
        isClaimed: false,
        claimedAt: null,
        updatedAt: new Date(),
      };

      await enrollmentsCol.updateOne(
        { enrollmentNumber: normEnrollment },
        {
          $set: enrollmentDoc,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      enrollmentsUpserted++;

      // 2. Upsert into 'users' (NextCampus active student accounts collection)
      const userDoc = {
        _id: `usr_${normEnrollment.toLowerCase()}`,
        id: `usr_${normEnrollment.toLowerCase()}`,
        name: s.name,
        preferredName: firstName,
        email: normEmail,
        password: defaultPasswordHash,
        role: 'student',
        enrollmentNumber: normEnrollment,
        studentId: normEnrollment,
        department: dept,
        academicYear: 'Class of 2029',
        semester: '1st Year • Semester 2',
        bio: `Undergraduate student in ${dept} at Mewar University.`,
        phone: '',
        residence: 'Mewar Campus Student Hall',
        emergencyContact: '',
        skills: ['Python', 'Data Structures', 'Problem Solving', 'Web Engineering'],
        societies: [],
        preferences: {
          notifications: {
            scheduleAlerts: true,
            careUpdates: true,
            ecoDigests: false,
            skillInvites: true,
            emergencyBroadcasts: true,
          },
          accessibility: {
            highContrast: false,
            reduceMotion: false,
            screenReader: false,
            textScale: 'Default (100%)',
            themePreset: 'Dark Licorice',
          },
          privacy: {
            skillCampusVisible: true,
            directoryVisible: true,
          },
          twoFactorEnabled: false,
          notificationsEnabled: true,
          darkTheme: true,
          emailAlerts: true,
        },
        updatedAt: new Date(),
      };

      await usersCol.updateOne(
        { enrollmentNumber: normEnrollment },
        {
          $set: userDoc,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      usersUpserted++;

      // 3. Upsert into 'students' (dedicated student roster table)
      const directStudentDoc = {
        name: s.name,
        email: normEmail,
        enrollment: normEnrollment,
        enrollmentNumber: normEnrollment,
        department: dept,
        academicYear: 'Class of 2029',
        admissionYear: 2025,
        status: 'active',
        updatedAt: new Date(),
      };

      await studentsCol.updateOne(
        { enrollment: normEnrollment },
        {
          $set: directStudentDoc,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      studentsUpserted++;
    }

    console.log(`\n🎉 SEED COMPLETE:`);
    console.log(` - enrollments: ${enrollmentsUpserted} records inserted/updated`);
    console.log(` - users: ${usersUpserted} student user accounts inserted/updated`);
    console.log(` - students: ${studentsUpserted} student profile records inserted/updated`);

    // Verify counts in DB
    const totalEnrollments = await enrollmentsCol.countDocuments();
    const totalUsers = await usersCol.countDocuments();
    const totalStudents = await studentsCol.countDocuments();

    console.log(`\n📊 Current MongoDB Collection Totals:`);
    console.log(` - enrollments total: ${totalEnrollments}`);
    console.log(` - users total: ${totalUsers}`);
    console.log(` - students total: ${totalStudents}`);

    // Sample check: find the first and last student from DB
    const firstCheck = await usersCol.findOne({ enrollmentNumber: 'MUR2509373' }, { projection: { password: 0 } });
    const lastCheck = await usersCol.findOne({ enrollmentNumber: 'MUR2509432' }, { projection: { password: 0 } });

    console.log(`\n🔍 First record verified (${firstCheck.enrollmentNumber}): ${firstCheck.name} <${firstCheck.email}>`);
    console.log(`🔍 Last record verified (${lastCheck.enrollmentNumber}): ${lastCheck.name} <${lastCheck.email}>`);

    await mongoose.disconnect();
    console.log('✅ MongoDB connection closed gracefully.');
  } catch (err) {
    console.error('❌ Error seeding student data:', err);
    process.exit(1);
  }
}

seedStudents();

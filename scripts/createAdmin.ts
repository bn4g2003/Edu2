import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUMACtBg9EOFqM1RniDJh8F7Ed3X1ttok",
  authDomain: "dayhoctructuyenquavideo.firebaseapp.com",
  projectId: "dayhoctructuyenquavideo",
  storageBucket: "dayhoctructuyenquavideo.firebasestorage.app",
  messagingSenderId: "989572036444",
  appId: "1:989572036444:web:6f83a36aeb5513267c7399",
  measurementId: "G-CEDYBETVF1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdminAccount() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  const adminName = 'Quản trị viên';

  try {
    console.log('Đang kiểm tra tài khoản admin...');

    // Kiểm tra email đã tồn tại chưa
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', adminEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('⚠️  Tài khoản admin đã tồn tại!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Mật khẩu:', adminPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(0);
    }

    console.log('Đang tạo tài khoản admin...');

    const uid = `admin_${Date.now()}`;
    const userProfile = {
      uid: uid,
      email: adminEmail,
      password: adminPassword,
      displayName: adminName,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), userProfile);
    console.log('✅ Tài khoản admin đã được tạo thành công!');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Mật khẩu:', adminPassword);
    console.log('👤 Vai trò: Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Lưu ý: Mật khẩu chưa được mã hóa!');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Lỗi khi tạo tài khoản admin:', error.message);
    process.exit(1);
  }
}

createAdminAccount();

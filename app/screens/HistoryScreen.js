import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Modal,
  FlatList,
} from 'react-native';
import {
  User,
  Wallet,
  CreditCard,
  Link2,
  ClipboardList,
  Receipt,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Share2,
  Home,
  Users,
  CircleUser,
} from 'lucide-react-native';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

const MineScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);

  const [ordersVisible, setOrdersVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [recordsVisible, setRecordsVisible] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const handleInviteLink = async () => {
    try {
      await Share.share({
        message: `Sikkaa Corp join karo aur earning shuru karo! Mera referral code use karo: ${user?.referralCode || 'S199FU7'}\n\nApp download link: https://sikkaa-app-production.up.railway.app`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrdersPress = async () => {
    setOrdersVisible(true);
    setOrdersLoading(true);
    try {
      const res = await client.get('/orders/my-orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handlePaymentRecordPress = async () => {
    setRecordsVisible(true);
    setRecordsLoading(true);
    try {
      const [ordersRes, depositsRes, withdrawalsRes] = await Promise.all([
        client.get('/orders/my-orders'),
        client.get('/deposit/my-deposits'),
        client.get('/withdraw/history'),
      ]);
      const orderRecords = ordersRes.data.orders.map((o) => ({
        _id: o._id,
        type: 'Package',
        title: o.product?.name || 'Package',
        amount: o.amount,
        status: o.status,
        createdAt: o.createdAt,
      }));
      const depositRecords = depositsRes.data.deposits.map((d) => ({
        _id: d._id,
        type: 'Deposit',
        title: 'Deposit',
        amount: d.amount,
        status: d.status,
        createdAt: d.createdAt,
      }));
      const withdrawalRecords = withdrawalsRes.data.withdrawals.map((w) => ({
        _id: w._id,
        type: 'Withdrawal',
        title: 'Withdrawal',
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt,
      }));
      const merged = [...orderRecords, ...depositRecords, ...withdrawalRecords].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecords(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const fetchWalletData = async () => {
  try {
    const balRes = await client.get('/wallet/balance');
    setBalance(balRes.data.balance);

    const depositRes = await client.get('/deposit/my-deposits');
    const approvedDeposits = depositRes.data.deposits.filter((d) => d.status === 'approved');
    const depositSum = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);
    setTotalDeposit(depositSum);

    const withdrawRes = await client.get('/withdraw/history');
    const approvedWithdrawals = withdrawRes.data.withdrawals.filter(
      (w) => w.status === 'approved' || w.status === 'completed'
    );
    const withdrawSum = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    setTotalWithdrawal(withdrawSum);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchWalletData();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Mine</Text>
        <View style={styles.topIconsRow}>
          <ShieldCheck color="#4ade80" size={24} />
          <TouchableOpacity onPress={fetchWalletData}>
          <RefreshCw color="#fff" size={24} />
          </TouchableOpacity>
          <Share2 color="#fff" size={24} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.shareCode}>Share code: {user?.referralCode || 'S199FU7'}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs{balance}</Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs{totalDeposit}</Text>
              <Text style={styles.statLabel}>Recharge</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs{totalWithdrawal}</Text>
              <Text style={styles.statLabel}>Withdrawal</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem icon={<Wallet color="#fff" size={22} />} label="Wallet" onPress={( ) => navigation.navigate("Wallet")} />
          <MenuItem icon={<CreditCard color="#fff" size={22} />} label="Bind bank card" />
          <MenuItem icon={<Link2 color="#fff" size={22} />} label="Invite Link" onPress={handleInviteLink} />
          <MenuItem icon={<ClipboardList color="#fff" size={22} />} label="Orders" onPress={handleOrdersPress} />
          <MenuItem icon={<Receipt color="#fff" size={22} />} label="Payment Record" onPress={handlePaymentRecordPress} />
        </View>
      </ScrollView>

      <BottomNav />

      <Modal visible={ordersVisible} animationType="slide" onRequestClose={() => setOrdersVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0c1b' }}>
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>My Orders</Text>
            <TouchableOpacity onPress={() => setOrdersVisible(false)}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>
                {ordersLoading ? 'Loading...' : 'No orders yet'}
              </Text>
            }
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#1d1929', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{item.product?.name}</Text>
                <Text style={{ color: '#8a8a99', marginTop: 4 }}>Rs {item.amount}</Text>
                <Text
                  style={{
                    color:
                      item.status === 'approved'
                        ? '#4CD964'
                        : item.status === 'rejected'
                        ? '#FF3B30'
                        : '#FFC107',
                    marginTop: 4,
                    textTransform: 'capitalize',
                  }}
                >
                  {item.status}
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>

      <Modal visible={recordsVisible} animationType="slide" onRequestClose={() => setRecordsVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0c1b' }}>
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Payment Record</Text>
            <TouchableOpacity onPress={() => setRecordsVisible(false)}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={records}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>
                {recordsLoading ? 'Loading...' : 'No records yet'}
              </Text>
            }
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#1d1929', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
                  <Text style={{ color: '#8a8a99', fontSize: 12 }}>{item.type}</Text>
                </View>
                <Text style={{ color: '#8a8a99', marginTop: 4 }}>Rs {item.amount}</Text>
                <Text
                  style={{
                    color:
                      item.status === 'approved' || item.status === 'completed'
                        ? '#4CD964'
                        : item.status === 'rejected'
                        ? '#FF3B30'
                        : '#FFC107',
                    marginTop: 4,
                    textTransform: 'capitalize',
                  }}
                >
                  {item.status}
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.iconCircle}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <ChevronRight color="#5b5b66" size={20} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c1b',
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#1d1929',
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  topIconsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#1d1929',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d254d',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#141120',
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#0095ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareCode: {
    color: '#8a8a99',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#7c5cfc',
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#e6e0ff',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  menuContainer: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1d1929',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d254d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#141120',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2d254d',
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabelInactive: {
    color: '#5b5b66',
    fontSize: 12,
    marginTop: 4,
  },
  navLabelActive: {
    color: '#7c5cfc',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default MineScreen;
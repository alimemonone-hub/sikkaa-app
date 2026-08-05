import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  CircleUser
} from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
const { width } = Dimensions.get('window');

const MineScreen = ({Navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header / Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchIconPlaceholder} />
        <Text style={styles.topBarTitle}>Mine</Text>
        <View style={styles.topIconsRow}>
          <ShieldCheck color="#4ade80" size={24} />
          <RefreshCw color="#fff" size={24} />
          <Share2 color="#fff" size={24} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
             <View style={styles.logoContainer}>
                {/* Valero Logo Placeholder */}
                <Text style={styles.logoText}>V</Text>
                <View style={styles.logoWave} />
             </View>
             <View style={styles.userInfo}>
                <Text style={styles.userName}>03182181269</Text>
                <Text style={styles.shareCode}>Share code: s199FU7</Text>
             </View>
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs245</Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs500</Text>
              <Text style={styles.statLabel}>Recharge</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs0</Text>
              <Text style={styles.statLabel}>Withdrawal</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem icon={<Wallet color="#fff" size={22} />} label="Wallet" />
          <MenuItem icon={<CreditCard color="#fff" size={22} />} label="Bind bank card" />
          <MenuItem icon={<Link2 color="#fff" size={22} />} label="Invite Link" />
          <MenuItem icon={<ClipboardList color="#fff" size={22} />} label="Orders" />
          <MenuItem icon={<Receipt color="#fff" size={22} />} label="Payment Record" />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.menuItem}>
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  shareCode: {
    color: '#a1a1aa',
    fontSize: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1d1929',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1d1929',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
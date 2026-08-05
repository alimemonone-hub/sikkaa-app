import BottomNav from '../components/BottomNav';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { 
  Database, 
  RefreshCw, 
  LayoutGrid, 
  Users, 
  CircleUser,
  TrendingUp,
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Database color="#4ade80" size={24} />
          <Text style={styles.brandText}>SIKKA_CORP</Text>
        </View>
        <View style={styles.topIcons}>
          <RefreshCw color="#fff" size={20} />
          <View style={styles.statusDot} />
        </View>
      </View>

      {/* Log Status Banner */}
      <View style={styles.logBanner}>
        <Text style={styles.logText}>
          LOG_STATUS: <Text style={styles.logHighlight}>User +92 033****6429 withdraw Rs330</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Slider */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000' }} 
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>ACTIVE_NODE</Text>
            </View>
          </View>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.titleIndicator} />
            <Text style={styles.sectionTitle}>NODES_AVAILABLE</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>/VIEW_ALL</Text>
          </TouchableOpacity>
        </View>

        {/* Nodes Grid */}
        <View style={styles.nodesGrid}>
          <NodeCard 
            title="Ardmore Node" 
            price="Rs 250" 
            yieldVal="30%" 
            cycle="90D"
            image="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=500"
          />
          <NodeCard 
            title="Benicia Node" 
            price="Rs 500" 
            yieldVal="31%" 
            cycle="90D"
            image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=500"
          />
          <NodeCard 
            title="Corpus Node" 
            price="Rs 1,000" 
            yieldVal="33%" 
            cycle="90D"
            image="https://images.unsplash.com/photo-1563200190-252709e99277?auto=format&fit=crop&q=80&w=500"
          />
          <NodeCard 
            title="Houston Node" 
            price="Rs 2,000" 
            yieldVal="35%" 
            cycle="90D"
            image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=500"
          />
        </View>

        {/* Global Throughput Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>GLOBAL THROUGHPUT</Text>
            <TrendingUp color="#4ade80" size={16} />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsValue}>1.2M Barrels</Text>
            <Text style={styles.statsPercent}>+2.4%</Text>
          </View>
          <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}></View>
             <TrendingUp color="#7c5cfc" size={40} />
        </View>
      </ScrollView>

    <BottomNav />
    </SafeAreaView>
  );
};

const NodeCard = ({ title, price, yieldVal, cycle, image }) => (
  <View style={styles.nodeCard}>
    <Image source={{ uri: image }} style={styles.nodeImage} />
    <View style={styles.nodeContent}>
      <Text style={styles.nodeTitle}>{title}</Text>
      <Text style={styles.nodePrice}>{price}</Text>
      
      <View style={styles.nodeMetrics}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>YIELD</Text>
          <Text style={styles.metricValue}>{yieldVal}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>CYCLE</Text>
          <Text style={styles.metricValue}>{cycle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.initializeButton}>
        <Text style={styles.buttonText}>INITIALIZE</Text>
        <Zap color="#fff" size={14} fill="#fff" />
      </TouchableOpacity>
    </View>
  </View>
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
    paddingHorizontal: 20,
    backgroundColor: '#141120',
    borderBottomWidth: 1,
    borderBottomColor: '#1d1929',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    color: '#4ade80',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  logBanner: {
    backgroundColor: '#1d1929',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  logText: {
    color: '#fff',
    fontSize: 11,
    letterSpacing: 1,
  },
  logHighlight: {
    color: '#a1a1aa',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    height: 200,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2d254d',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 12, 27, 0.4)',
    padding: 16,
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#7c5cfc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heroTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#7c5cfc',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#7c5cfc',
    borderRadius: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  viewAllText: {
    color: '#7c5cfc',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  nodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  nodeCard: {
    width: (width - 48) / 2,
    backgroundColor: '#1d1929',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d254d',
    overflow: 'hidden',
  },
  nodeImage: {
    width: '100%',
    height: 100,
  },
  nodeContent: {
    padding: 12,
  },
  nodeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  nodePrice: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  nodeMetrics: {
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: 'bold',
  },
  initializeButton: {
    backgroundColor: '#7c5cfc',
    height: 36,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsCard: {
    backgroundColor: '#141120',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d254d',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsLabel: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 16,
  },
  statsValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  statsPercent: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
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
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#7c5cfc',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
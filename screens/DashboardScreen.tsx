// screens/DashboardScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import StyleSheet from '../utils/styleShim';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const user = auth.currentUser;

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [vehicleNo, setVehicleNo] = useState('');
    const [bidNo, setBidNo] = useState('');
    const [quantity, setQuantity] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [fuelFilled, setFuelFilled] = useState('');

    // Dummy trips state (recent activity will show latest trips)
    const [trips, setTrips] = useState([
        { id: 1, truck: 'TRK-101', status: 'En route to Delhi', time: '2 hours ago' },
        { id: 2, truck: 'TRK-205', status: 'Delivered', time: '4 hours ago' },
    ]);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await signOut(auth);
                    navigation.replace('Login');
                },
            },
        ]);
    };

    const handleAddTrip = () => {
        if (!vehicleNo || !bidNo || !quantity || !departureTime) {
            Alert.alert('Error', 'Please fill required fields (Vehicle, Bid, Quantity, Departure)');
            return;
        }

        const newTrip = {
            id: trips.length + 1,
            truck: vehicleNo.toUpperCase(),
            status: `From: ${departureTime} → To: ${arrivalTime || 'Ongoing'}`,
            time: 'Just now',
        };

        setTrips([newTrip, ...trips]); // Add to top

        Alert.alert('Success ✓', `Trip added for ${vehicleNo.toUpperCase()}`);

        // Reset form & close modal
        setVehicleNo('');
        setBidNo('');
        setQuantity('');
        setDepartureTime('');
        setArrivalTime('');
        setFuelFilled('');
        setModalVisible(false);
    };

    // Stats (dummy)
    const stats = [
        { title: 'Total Trucks', value: '24', color: '#1d4ed8' },
        { title: 'Active Trips', value: trips.length.toString(), color: '#16a34a' },
        { title: 'Drivers Online', value: '15', color: '#ea580c' },
        { title: 'Pending Loads', value: '7', color: '#7c3aed' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back!</Text>
                        <Text style={styles.emailText}>{user?.email || 'User'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                        </View>
                    ))}
                </View>

                {/* Recent Trips */}
                <Text style={styles.sectionTitle}>Recent Trips</Text>
                <View style={styles.activityList}>
                    {trips.length === 0 ? (
                        <Text style={styles.emptyText}>No trips yet. Add one!</Text>
                    ) : (
                        trips.map((item) => (
                            <View key={item.id} style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <View style={styles.activityContent}>
                                    <Text style={styles.truckName}>{item.truck}</Text>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            {/* Add Trip Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Trip</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Vehicle No (e.g., TRK-101)"
                            value={vehicleNo}
                            onChangeText={setVehicleNo}
                            autoCapitalize="characters"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Bid No"
                            value={bidNo}
                            onChangeText={setBidNo}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Quantity (tons)"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Departure Time (e.g., 2026-01-06 08:00)"
                            value={departureTime}
                            onChangeText={setDepartureTime}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Arrival Time (optional)"
                            value={arrivalTime}
                            onChangeText={setArrivalTime}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Fuel Filled (liters, optional)"
                            value={fuelFilled}
                            onChangeText={setFuelFilled}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddTrip}
                            >
                                <Text style={styles.saveText}>Add Trip</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    emailText: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    statTitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    activityList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1d4ed8',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    truckName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    statusText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    timeText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#1d4ed8',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '300',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f9fafb',
        marginBottom: 14,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#e5e7eb',
    },
    saveButton: {
        backgroundColor: '#1d4ed8',
    },
    cancelText: {
        color: '#374151',
        fontWeight: '600',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#9ca3af',
        textAlign: 'center',
        padding: 20,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: '#f9fafb',
        marginBottom: 14,
    },
    dateText: {
        fontSize: 16,
        color: '#374151',
    },
});
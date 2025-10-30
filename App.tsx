import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  Platform,
} from 'react-native';

const AppleHealthKit = require('react-native-health').default;

const App = (): React.JSX.Element => {
  const [permissionStatus, setPermissionStatus] = useState<string>('');
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  // HealthKit 권한 요청
  const requestHealthKitPermission = (): void => {
    // iOS에서만 작동
    if (Platform.OS !== 'ios') {
      Alert.alert('알림', 'HealthKit은 iOS에서만 사용 가능합니다.');
      return;
    }

    setPermissionStatus('Initializing...');

    // 요청할 권한 설정
    const permissions = {
      permissions: {
        read: [
          'SleepAnalysis',
          'HeartRate',
        ],
        write: [],
      },
    };

    // HealthKit 초기화 및 권한 요청
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.error('HealthKit 초기화 오류:', error);
        setPermissionStatus(`Error: ${error}`);
        setIsPermissionGranted(false);
        return;
      }

      // 권한 요청 성공
      setPermissionStatus('Permission Granted');
      setIsPermissionGranted(true);
      console.log('HealthKit 권한이 허용되었습니다.');
    });
  };

  // 수면 데이터 가져오기
  const fetchSleepData = (): void => {
    // 최근 7일간의 데이터 가져오기
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    AppleHealthKit.getSleepSamples(
      options,
      (error: Object, results: any[]) => {
        if (error) {
          console.error('수면 데이터 가져오기 오류:', error);
          Alert.alert('오류', '수면 데이터를 가져오는 데 실패했습니다.');
          return;
        }

        // 결과를 콘솔에 출력
        console.log('수면 데이터 (최근 7일):', results);
        
        if (results && results.length > 0) {
          Alert.alert(
            '성공',
            `${results.length}개의 수면 데이터를 가져왔습니다. 콘솔을 확인하세요.`
          );
        } else {
          Alert.alert('알림', '수면 데이터가 없습니다.');
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HealthKit Sleep Data App</Text>

        {/* HealthKit 권한 요청 버튼 */}
        <View style={styles.buttonContainer}>
          <Button
            title="Request HealthKit Permission"
            onPress={requestHealthKitPermission}
            color="#007AFF"
          />
        </View>

        {/* 권한 상태 표시 */}
        {permissionStatus !== '' && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              상태: {permissionStatus}
            </Text>
          </View>
        )}

        {/* 수면 데이터 가져오기 버튼 */}
        <View style={styles.buttonContainer}>
          <Button
            title="Fetch Sleep Data"
            onPress={fetchSleepData}
            disabled={!isPermissionGranted}
            color="#34C759"
          />
        </View>

        {/* 안내 텍스트 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            1. 먼저 "Request HealthKit Permission"을 눌러 권한을 요청하세요.
          </Text>
          <Text style={styles.infoText}>
            2. 권한이 허용되면 "Fetch Sleep Data"를 눌러 최근 7일간의 수면 데이터를 가져옵니다.
          </Text>
          <Text style={styles.infoText}>
            3. 데이터는 콘솔에 출력됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  statusContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2E7D32',
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default App;


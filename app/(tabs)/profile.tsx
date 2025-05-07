import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen
 = () => {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Profile Screen</Text>
          <Text style={styles.subtitle}>Your profile information will go here.</Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        color: '#666',
      },
    });

export default ProfileScreen

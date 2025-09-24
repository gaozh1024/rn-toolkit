import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { modalService } from './ModalService';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modals, setModals] = useState(modalService.getModals());

    useEffect(() => {
        const unsubscribe = modalService.addListener(() => {
            setModals([...modalService.getModals()]);
        });

        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            {children}
            {modals.map((modal) => (
                <Modal
                    key={modal.key}
                    visible={true}
                    {...modal.config}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
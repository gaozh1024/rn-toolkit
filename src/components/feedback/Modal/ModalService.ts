import React from 'react';
import { Text } from 'react-native';
import { Modal, ModalProps } from './Modal';

export interface ModalConfig extends Omit<ModalProps, 'visible'> {
    key?: string;
}

interface ModalInstance {
    key: string;
    config: ModalConfig;
    resolve?: (value?: any) => void;
    reject?: (reason?: any) => void;
}

class ModalService {
    private static instance: ModalService;
    private modals: Map<string, ModalInstance> = new Map();
    private listeners: Set<() => void> = new Set();

    static getInstance(): ModalService {
        if (!ModalService.instance) {
            ModalService.instance = new ModalService();
        }
        return ModalService.instance;
    }

    private generateKey(): string {
        return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    // 显示模态框
    show(config: ModalConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            const key = config.key || this.generateKey();

            const instance: ModalInstance = {
                key,
                config: {
                    ...config,
                    onClose: () => {
                        this.hide(key);
                        config.onClose?.();
                        resolve(undefined);
                    },
                },
                resolve,
                reject,
            };

            this.modals.set(key, instance);
            this.notifyListeners();
        });
    }

    // 隐藏模态框
    hide(key: string): void {
        if (this.modals.has(key)) {
            this.modals.delete(key);
            this.notifyListeners();
        }
    }

    // 隐藏所有模态框
    hideAll(): void {
        this.modals.clear();
        this.notifyListeners();
    }

    // 获取所有模态框
    getModals(): ModalInstance[] {
        return Array.from(this.modals.values());
    }

    // 添加监听器
    addListener(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    // 便捷方法：确认对话框
    confirm(config: {
        title?: string;
        content?: string;
        okText?: string;
        cancelText?: string;
        onOk?: () => void;
        onCancel?: () => void;
    }): Promise<boolean> {
        return new Promise((resolve) => {
            this.show({
                title: config.title || '确认',
                children: React.createElement(Text, {}, config.content),
                onClose: () => {
                    config.onCancel?.();
                    resolve(false);
                },
            });
        });
    }

    // 便捷方法：信息对话框
    info(config: {
        title?: string;
        content?: string;
        okText?: string;
        onOk?: () => void;
    }): Promise<void> {
        return this.show({
            title: config.title || '信息',
            children: React.createElement(Text, {}, config.content),
            onClose: config.onOk,
        });
    }
}

export const modalService = ModalService.getInstance();
export { ModalService };
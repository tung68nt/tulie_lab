import { ISettingRepository } from './interfaces/setting.repository.interface';

export class SettingService {
    constructor(private settingRepository: ISettingRepository) { }

    async getAllSettings() {
        const settings = await this.settingRepository.findAll();
        // Return as a key-value object for easier frontend use
        return settings.reduce((acc: any, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
    }

    async updateSettings(settings: Record<string, string>) {
        const updateData = Object.entries(settings).map(([key, value]) => ({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        }));

        await this.settingRepository.updateMany(updateData);
        return { success: true };
    }

    async getSetting(key: string) {
        return this.settingRepository.findByKey(key);
    }

    /**
     * Get multiple settings by keys.
     * Returns a key-value object with only the requested keys.
     */
    async getSettings(keys: string[]): Promise<Record<string, string>> {
        const allSettings = await this.settingRepository.findAll();
        const result: Record<string, string> = {};
        for (const setting of allSettings) {
            if (keys.includes(setting.key)) {
                result[setting.key] = setting.value;
            }
        }
        return result;
    }

    async getApiKey() {
        const setting = await this.settingRepository.findByKey('SYSTEM_API_KEY');
        return setting?.value || null;
    }

    async regenerateApiKey() {
        const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        await this.settingRepository.upsert('SYSTEM_API_KEY', newKey, 'text');
        return newKey;
    }
}

type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
    private services = new Map<string, any>();

    register<T>(name: string, instance: T): void {
        this.services.set(name, instance);
    }

    resolve<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found in DI Container`);
        }
        return service;
    }
}

export const container = new DIContainer();

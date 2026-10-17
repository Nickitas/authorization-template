export function parseBool(value: string): boolean {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const loverValue = value.trim().toLowerCase();

        if (loverValue === 'true') {
            return true;
        }
        if (loverValue === 'false') {
            return false;
        }
    }

    throw new Error(`Не удалось преобразовать значение ${value} в bool`);
}
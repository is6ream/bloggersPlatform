const objects: any[] = [];

export const ioc = {
  getInstance<T>(ClassType: any) {
    const targetInstance = objects.find((o) => o instanceof ClassType);
    return targetInstance as T;
  },
};

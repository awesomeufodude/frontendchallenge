export const apiInfo = {
    title: "Nexus",
    description: "Nexus API",
    version: "1.0.0",
    apiurl : process.env.NEXT_PUBLIC_API_URL,
    routes : {
        reports : "/reports",
        items : (id: number) => `/items/${id}`,
        login: "/auth/login",
        getAllSurvivors: "/survivors",
        createSurvivors: "/survivors",
        getInventory: (id: string) => `/inventory/${id}`,
        getItems: "/items",
        trade: "/trade",
        register: "/auth/register"
    }
}
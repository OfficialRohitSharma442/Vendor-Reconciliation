import axios from "axios";

export async function getAllUsers(token: string) {
    try {
        const response = await axios.get("https://concerned-plum-crayfish.cyclic.app/api/user/getAllUser", {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        return response;
    } catch (error) {

        throw error; // You might want to handle the error or remove this line based on your use case
    }
}

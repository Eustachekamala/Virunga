import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

export const apiService = () => {
    const { token } = useContext(AuthContext); // ✅ correct way

    return axios.create({
        baseURL: "http://localhost:8080/api/v1",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    });
};

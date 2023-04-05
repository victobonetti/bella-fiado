import axios, { AxiosInstance } from "axios";



interface AuthServiceProps {
    apiUrl: string;
}

class AuthService {
    private readonly apiUrl: string;
    private readonly axiosInstance: AxiosInstance;

    constructor(props: AuthServiceProps) {
        this.apiUrl = props.apiUrl;

        this.axiosInstance = axios.create({
            baseURL: this.apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public setAuthorizationToken(token: string): void {
        this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    public async login(username: string, password: string): Promise<string> {
        const response = await this.axiosInstance.post(this.apiUrl, { username, password });
        const { token } = response.data;
        this.setAuthorizationToken(token);
        return response.data;
    }

    public async logout(): Promise<void> {
        delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
}

export default AuthService;
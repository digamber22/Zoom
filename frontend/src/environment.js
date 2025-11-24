const getBackendUrl = () => {
    return process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
}

export const BACKEND_URL = getBackendUrl();

import axios from 'axios';


//const API_BASE_URL = 'http://10.2.142.123:8123';
const API_BASE_URL = 'http://127.0.0.1:8080';
const api = axios.create({
    baseURL: API_BASE_URL?.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export interface JobsResponse {
    job_names: string[];
}

export interface DatasetsResponse {
    dataset_names: string[];
}

export const fetchJobs = async (): Promise<JobsResponse> => {
    try {
        const response = await api.get('/api/getJobs');
        return response.data;
        
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const fetchDatasets = async (job: string): Promise<DatasetsResponse> => {
    try {
        const response = await api.get('/api/getDatasets', { params: { job } });
        console.log(`Fetching datasets for job ${job}`);
        console.log(response.data);
        return response.data;
        
    } catch (error) {
        console.error('Error fetching datasets:', error);
        throw error;
    }
};

export const fetchImages = async (job: string, dataset: string) => {
    try {
        const response = await api.get('/api/getImages', { params: { job, dataset } });
        console.log(`Fetching images for job ${job} and dataset ${dataset}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};

export const fetchBase64Images = async (job: string, dataset: string) => {
    try {
        const response = await api.get('/api/getBase64Images', { params: { job, dataset } });
        console.log(`Fetching base64 images for job ${job} and dataset ${dataset}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching base64 images:', error);
        throw error;
    }
};

export const buildUrl = (path: string) => `${api.defaults.baseURL}${path}`;

export const getImageUrl = (job: string, dataset: string, imageName: string) =>
    buildUrl(`/static/${job}/${dataset}/image/${imageName}`);


export const savePendingReview = async (data: any) => {
    try {
        console.log('Saving pending review data:', data);
        const response = await api.post('/api/savePendingReview', data.images);
        console.log('Saved pending review data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving pending review data:', error);
        throw error;
    }
};

export const getPendingReview = async (flatten: boolean = false) => {
    try {
        const response = await api.get('/api/getPendingReview', { params: { flatten } });
        console.log('Fetched pending review data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending review data:', error);
        throw error;
    }
};

export const approvedRemove = async () => {
    try {
        const response = await api.post('/api/approvedRemove');
        console.log('Approved items removed:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error removing approved items:', error);
        throw error;
    }
};

export const unApprovedRemove = async () => {
    try {
        const response = await api.post('/api/unapprovedRemove');
        console.log('Unapproved items cleared:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error clearing unapproved items:', error);
        throw error;
    }
};
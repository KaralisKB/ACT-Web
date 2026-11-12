import { useState } from 'react';
import api from '../services/apiClient';

export const useTransaction = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const transaction = async (user, clientId, payload) => {
        setIsLoading(true);
        setError(null);

        if (!clientId) {
            setError("No client selected. Please select a client.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post(`/api/transaction`, {
                userId: user.id,
                clientId,
                ...payload,
            });

            setIsLoading(false);
            return response.data; // Success response
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.error || 'Transaction failed');
            throw err;
        }
    };

    return { transaction, error, isLoading };
};

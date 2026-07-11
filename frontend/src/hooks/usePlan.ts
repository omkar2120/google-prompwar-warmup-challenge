import { useMutation } from '@tanstack/react-query';
import { planService } from '../services/api';
import { GeneratePlanRequest, GeneratePlanResponse } from '../types/api';

export const usePlanMutation = () => {
  return useMutation<GeneratePlanResponse, Error, GeneratePlanRequest>({
    mutationFn: (data) => planService.generatePlan(data),
    onError: (error) => {
      console.error('Error generating plan:', error);
    },
  });
};

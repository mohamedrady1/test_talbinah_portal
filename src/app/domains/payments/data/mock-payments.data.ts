import { IPaymentsListingResponseDto } from "../dtos";

export const mockPayments: IPaymentsListingResponseDto = {
  items: [
    {
      id: '1A',
      title: 'Amazing Podcast Episode 1',
      description: 'An insightful conversation about tech trends and future innovations.',
    },
    {
      id: '1B',
      title: 'Amazing Podcast Episode 2',
      description: 'A deep dive into the world of AI and its impact on society.',
    },
    {
      id: '1C',
      title: 'Amazing Podcast Episode 3',
      description: 'Exploring the future of space exploration and new frontiers.',
    },
    {
      id: '1D',
      title: 'Amazing Podcast Episode 4',
      description: 'Understanding the rise of remote work and its long-term effects on businesses.',
    },
    {
      id: '1E',
      title: 'Amazing Podcast Episode 5',
      description: 'A look into the sustainability of digital currencies and their global impact.',
    }
  ]
};

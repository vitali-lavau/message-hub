import type { Channel } from '~/types/Channel';

export const channelsForUser1: Channel[] = [
    { id: 1, name: 'General Discussion', members: [1, 2, 3] },
    { id: 2, name: 'Announcements', members: [1, 4, 5] },
    { id: 3, name: 'Project Updates', members: [1, 6, 7] },
];

export const channelsForOtherUsers: Channel[] = [
    { id: 4, name: 'Marketing Team', members: [2, 4, 5] },
    { id: 5, name: 'Design Team', members: [3, 6] },
    { id: 6, name: 'Technical Support', members: [2, 7, 8] },
];

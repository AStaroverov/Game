import { createComponent } from '../../lib/ECS/Component';

export const TagComponentID = 'TAG' as const;
export type TagComponent = ReturnType<typeof createTagComponent>;
export const createTagComponent = (tags?: string[]) => createComponent(TagComponentID, { tags });

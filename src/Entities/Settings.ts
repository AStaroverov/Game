import { createEntity } from '../../lib/ECS/Entity';
import { createLangComponent } from '../Components/Lang';

export const SettingsEntityID = 'SETTINGS_ENTITY' as const;
export type SettingsEntity = ReturnType<typeof createSettingsEntity>;
export const createSettingsEntity = () => createEntity(SettingsEntityID, [createLangComponent()]);

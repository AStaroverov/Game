import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { createSettingsEntity, SettingsEntityID } from '../../Entities/Settings';
import { GameHeap } from '../../heap';

export function initSettingsSystem(heap: GameHeap): void {
    const settings = getEntities(heap, SettingsEntityID);

    if (settings.length === 0) {
        addEntity(heap, createSettingsEntity());
    }
}

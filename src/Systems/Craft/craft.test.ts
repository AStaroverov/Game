import { describe, expect, it } from '@jest/globals';

import { seedResourceMap } from '../../Components/Backpack/resources';
import { ECraftAction, getFeaturesAvailableActions, getResourcesAvailableActions } from './actions';
import { ECraftResourceFeature } from './resources';
import { transformResource, transformResources } from './transform/resources';

describe('Craft ', () => {
    it('transform Lemon', () => {
        const resource = seedResourceMap.Lemon;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([
            ECraftAction.Dry,
            ECraftAction.Grind,
            ECraftAction.Squeeze,
        ]);

        const dried = transformResource(resource, ECraftAction.Dry);

        expect(dried.name).toBe('Dried Lemon');
        expect(dried.features.slice().sort()).toEqual([
            ECraftResourceFeature.Brittle,
            ECraftResourceFeature.Dry,
        ]);

        const ground = transformResource(resource, ECraftAction.Grind);

        expect(ground.name).toBe('Ground Lemon');
        expect(ground.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Watery,
        ]);

        const squeezed = transformResource(resource, ECraftAction.Squeeze);

        expect(squeezed.name).toBe('Squeezed Lemon');
        expect(squeezed.features.slice().sort()).toEqual([ECraftResourceFeature.Liquid]);
    });

    it('transform Gross', () => {
        const resource = seedResourceMap.Gross;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([ECraftAction.Dry, ECraftAction.Grind]);

        const dried = transformResource(resource, ECraftAction.Dry, 'Dried Gross');

        expect(dried.features.slice().sort()).toEqual([
            ECraftResourceFeature.Brittle,
            ECraftResourceFeature.Dry,
        ]);

        const ground = transformResource(resource, ECraftAction.Grind, 'Ground Gross');

        expect(ground.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Viscous,
            ECraftResourceFeature.Wet,
        ]);
    });

    it('transform Carnation', () => {
        const resource = seedResourceMap.Carnation;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([ECraftAction.Grind]);

        const ground = transformResource(resource, ECraftAction.Grind, 'Ground Gross');

        expect(ground.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Dry,
        ]);
    });

    it('transform double dry', () => {
        const res = [seedResourceMap.Garlic, seedResourceMap['Cocoa beans']];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Grind]);

        const result = transformResources(res, ECraftAction.Grind, '');

        expect(result.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Dry,
        ]);
    });

    it('transform double wet', () => {
        const res = [seedResourceMap.Lemon, seedResourceMap.Gross];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Grind]);

        const result = transformResources(res, ECraftAction.Grind, 'Ground Lemon, Gross');

        expect(result.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Viscous,
            ECraftResourceFeature.Wet,
        ]);
    });

    it('transform Garlic,Lemon,Gross', () => {
        const res = [seedResourceMap.Garlic, seedResourceMap.Lemon, seedResourceMap.Gross];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Grind]);

        const result = transformResources(res, ECraftAction.Grind, '');

        expect(result.features.slice().sort()).toEqual([
            ECraftResourceFeature.Crushed,
            ECraftResourceFeature.Viscous,
            ECraftResourceFeature.Wet,
        ]);
    });

    it('transform Water,Garlic', () => {
        const res = [seedResourceMap.Water, seedResourceMap.Garlic];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = transformResources(res, ECraftAction.Mix, '');

        expect(result.features.slice().sort()).toEqual([ECraftResourceFeature.Liquid]);
    });

    it('transform Water,Lemon', () => {
        const res = [seedResourceMap.Water, seedResourceMap.Lemon];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = transformResources(res, ECraftAction.Mix, '');

        expect(result.features.slice().sort()).toEqual([ECraftResourceFeature.Liquid]);
    });

    it('transform Garlic,Lemon,Gross + Water', () => {
        const seedResources = [
            seedResourceMap.Garlic,
            seedResourceMap.Lemon,
            seedResourceMap.Gross,
        ];
        const resource1 = transformResources(seedResources, ECraftAction.Grind, '');
        const resource2 = transformResources(
            [resource1, seedResourceMap.Water],
            ECraftAction.Mix,
            '',
        );

        expect(resource2.features.slice().sort()).toEqual([ECraftResourceFeature.Liquid]);
    });
});

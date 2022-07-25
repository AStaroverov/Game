import { describe, expect, it } from '@jest/globals';

import { ESeedResourceId, getSeedResources } from '../Resources';
import { EResourceFeature } from '../Resources/def';
import { ECraftAction, getFeaturesAvailableActions, getResourcesAvailableActions } from './index';
import { mixResources, transformResource } from './transform/resources';

const { resourcesMap } = getSeedResources();

describe('Craft ', () => {
    it('transform Lemon', () => {
        const resource = resourcesMap.Lemon;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([
            ECraftAction.Dry,
            ECraftAction.Grind,
            ECraftAction.Squeeze,
        ]);

        const dried = transformResource(resource, ECraftAction.Dry);

        expect(dried.name).toBe('Dried Lemon');
        expect(dried.features.slice().sort()).toEqual([
            EResourceFeature.Brittle,
            EResourceFeature.Dry,
        ]);

        const ground = transformResource(resource, ECraftAction.Grind);

        expect(ground.name).toBe('Ground Lemon');
        expect(ground.features.slice().sort()).toEqual([
            EResourceFeature.Crushed,
            EResourceFeature.Watery,
        ]);

        const squeezed = transformResource(resource, ECraftAction.Squeeze);

        expect(squeezed.name).toBe('Squeezed Lemon');
        expect(squeezed.features.slice().sort()).toEqual([EResourceFeature.Liquid]);
    });

    it('transform Gross', () => {
        const resource = resourcesMap.Gross;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([ECraftAction.Dry, ECraftAction.Grind]);

        const dried = transformResource(resource, ECraftAction.Dry, 'Dried Gross');

        expect(dried.features.slice().sort()).toEqual([
            EResourceFeature.Brittle,
            EResourceFeature.Dry,
        ]);

        const ground = transformResource(resource, ECraftAction.Grind, 'Ground Gross');

        expect(ground.features.slice().sort()).toEqual([
            EResourceFeature.Crushed,
            EResourceFeature.Viscous,
            EResourceFeature.Wet,
        ]);
    });

    it('transform Carnation', () => {
        const resource = resourcesMap.Carnation;
        const actions = getFeaturesAvailableActions(resource.features);

        expect(actions.sort()).toEqual([ECraftAction.Grind]);

        const ground = transformResource(resource, ECraftAction.Grind, 'Ground Gross');

        expect(ground.features.slice().sort()).toEqual([
            EResourceFeature.Crushed,
            EResourceFeature.Dry,
        ]);
    });

    it('cant mix', () => {
        expect([]).toEqual(
            getResourcesAvailableActions([
                resourcesMap.Garlic,
                resourcesMap[ESeedResourceId.CocoaBeans],
            ]),
        );
        expect([]).toEqual(getResourcesAvailableActions([resourcesMap.Lemon, resourcesMap.Gross]));
    });

    it('Mix Water,Garlic', () => {
        const res = [resourcesMap.Water, resourcesMap.Garlic];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = mixResources(res, '');

        expect(result.features.slice().sort()).toEqual([EResourceFeature.Liquid]);
    });

    it('Mix Water,Lemon', () => {
        const res = [resourcesMap.Water, resourcesMap.Lemon];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = mixResources(res, '');

        expect(result.features.slice().sort()).toEqual([EResourceFeature.Liquid]);
    });

    it('Mix Ground Lemon,Garlic', () => {
        const res = [
            transformResource(resourcesMap.Lemon, ECraftAction.Grind),
            transformResource(resourcesMap.Garlic, ECraftAction.Grind),
        ];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = mixResources(res, '');

        expect(result.features.slice().sort()).toEqual([
            EResourceFeature.Crushed,
            EResourceFeature.Viscous,
            EResourceFeature.Wet,
        ]);
    });

    it('transform Ground Garlic,Lemon + Water', () => {
        const res = [
            resourcesMap.Water,
            transformResource(resourcesMap.Lemon, ECraftAction.Grind),
            transformResource(resourcesMap.Garlic, ECraftAction.Grind),
        ];
        const actions = getResourcesAvailableActions(res);

        expect(actions.sort()).toEqual([ECraftAction.Mix]);

        const result = mixResources(res, '');

        expect(result.features.slice().sort()).toEqual([
            EResourceFeature.Crushed,
            EResourceFeature.Liquid,
        ]);
    });
});

import { Opaque } from '../../types';
import { TSequence } from '../Sequence/def';

export enum EResourceFeature {
    Dry = 'Dry',
    Wet = 'Wet',
    Watery = 'Watery',
    Liquid = 'Liquid',

    Viscous = 'Viscous',
    Elastic = 'Elastic',
    Brittle = 'Brittle',
    Crushed = 'Crushed',
}

export type TResourceID = Opaque<'Resource', string>;

export type TResource = {
    id: TResourceID;
    name: string;
    sequence: TSequence;
    features: EResourceFeature[];
};

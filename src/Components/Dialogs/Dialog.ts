import { defaults } from 'lodash';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { DialogID } from './data';

export const DialogComponentID = 'Dialog' as const;
export type DialogStruct = { id: DialogID; step: number };
export type DialogComponent = ReturnType<typeof createDialogComponent>;
export const createDialogComponent = (props: { id: DialogID; step?: number }) =>
    createComponent(DialogComponentID, defaults({ step: 0 }, props) as DialogStruct);

export function updateDialogComponent(
    struct: ExtractStruct<DialogComponent>,
    { step }: { step: number },
) {
    struct.step = step;
}

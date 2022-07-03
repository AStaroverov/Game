import { createComponent, ExtractStruct } from '../../lib/ECS/Component';

export enum ELang {
    Ru = 'ru',
    En = 'en',
}

export const LangComponentID = 'LANG' as const;
export type LangComponent = ReturnType<typeof createLangComponent>;
export const createLangComponent = (lang: ELang = ELang.Ru) =>
    createComponent(LangComponentID, { lang });

export function setLang(struct: ExtractStruct<LangComponent>, lang: ELang): void {
    struct.lang = lang;
}

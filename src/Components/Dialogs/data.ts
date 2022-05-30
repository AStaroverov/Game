export enum DialogMember {
    Player = 'Player',
    Npc = 'Npc',
}

export enum DialogID {
    FirstMeeting = 0,
}

export const dialogFirstMeeting = [
    { speaker: DialogMember.Npc, content: `What are you doing here?` },
    { speaker: DialogMember.Player, content: `I don't remember anything...` },
    { speaker: DialogMember.Npc, content: `You should go to closest village` },
    { speaker: DialogMember.Player, content: `Where I can find it?` },
    {
        speaker: DialogMember.Npc,
        content: `Just go to the right, until you hit the village`,
    },
];

export const dialogs = {
    [DialogID.FirstMeeting]: dialogFirstMeeting,
};

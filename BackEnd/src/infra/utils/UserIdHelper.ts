import { nanoid } from 'nanoid';

export const generateViewerId = (): string =>{
    return `USR-${nanoid(10)}`;
}

export const generatePlayerId = (): string =>{
    return `PLR-${nanoid(10)}`;
}

export const generateManagerId = (): string =>{
    return `MNR-${nanoid(10)}`;
}
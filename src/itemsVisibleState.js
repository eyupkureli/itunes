import {
    atom
} from 'recoil';

const itemsVisibleState = atom({
    key: 'itemsVisibleState',
    default: false,
});

export default itemsVisibleState;
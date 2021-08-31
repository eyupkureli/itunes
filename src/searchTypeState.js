import {
    atom
} from 'recoil';

const searchTypeState = atom({
    key: 'searchTypeState',
    default: 'musicArtist',
});

export default searchTypeState;
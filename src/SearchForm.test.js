import React from 'react';
import { render, waitForElementToBeRemoved, fireEvent, within } from '@testing-library/react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import SearchForm from './SearchForm';

describe('SearchForm', () => {

    it('should render correctly in "debug" mode', () => {
        const component = shallow(<SearchForm debug />);
        expect(component).toMatchSnapshot();
    });

    it('renders', () => {
        const wrapper = shallow(<SearchForm />);
        expect(wrapper.exists()).toBe(true);
    });

    it('should display searchText', async () => {
        const onSearchTypeChange = jest.fn();
        const onSearchTextChange = jest.fn();

        const container = render(<SearchForm searchText="erol" searchType="album" onSearchTypeChange={onSearchTypeChange} onSearchTextChange={onSearchTextChange} />);
        expect(container.getByDisplayValue('erol')).toBeInTheDocument();
    });

});



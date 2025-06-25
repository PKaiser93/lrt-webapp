import { mount } from '@vue/test-utils';
import HelloWorld from '../shared/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
    it('renders props.msg', () => {
        const msg = 'Testnachricht';
        const wrapper = mount(HelloWorld, { props: { msg } });
        expect(wrapper.text()).toContain(msg);
    });
});

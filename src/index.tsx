export { default as DemoScreen } from './screens/Demo/demo'
import { Subject } from 'rxjs';
interface DefaultProps {
    api_url?: string
};
export const setDefaultProps = (obj: DefaultProps) => {
    console.log("set store", obj);
}

export const subject = new Subject()
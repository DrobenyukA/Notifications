type Identifier = string;
type Unregister = () => void;
interface Listener {
  name: string;
  action: EventListener;
}

const listeners = new Map<Identifier, Listener>();

function generateUID(prefix = 'UID'): Identifier {
    return `${prefix}-${(~~(Math.random() * 1e8)).toString(16)}`;
}

const unregister = (id: Identifier) => {
    if (listeners.has(id)) {
        const { name, action } = listeners.get(id) as Listener;
        window.removeEventListener(name, action);
        listeners.delete(id);
    }
};

const register = (name: string, action: EventListener): Unregister => {
    const id = generateUID(name);
    listeners.set(id, { name, action });
    window.addEventListener(name, action);
    
    return unregister.bind(this, id);
};

const emit = <T extends unknown>(name: string, data: T) => {
    window.dispatchEvent(new CustomEvent(name, { detail: data }))
};

const clearAll = () => {
    listeners.clear();
};

export { emit, register, clearAll };
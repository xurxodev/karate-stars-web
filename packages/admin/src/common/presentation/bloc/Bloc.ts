type Subscription<S> = (state: S) => void;

abstract class Bloc<S> {
    protected state: S;
    private listeners: Subscription<S>[] = [];

    constructor(initalState: S) {
        this.state = initalState;
    }

    public get getState(): S {
        return this.state;
    }

    changeState(state: S) {
        this.state = state;

        if (this.listeners.length > 0) {
            this.listeners.forEach(listener => listener(this.state));
        }
    }

    subscribe(listener: Subscription<S>) {
        this.listeners.push(listener);
    }

    unsubscribe(listener: Subscription<S>) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    protected dispose() {
        //Override on derivated  vaclass dispose if
        //you need clear subscriptions for example
    }
}

export default Bloc;
